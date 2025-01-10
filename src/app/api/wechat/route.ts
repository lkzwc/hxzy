import { NextRequest, NextResponse } from 'next/server'
import { parseStringPromise } from 'xml2js'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

// 验证消息签名
function verifySignature(timestamp: string, nonce: string, signature: string): boolean {
  try {
    const token = process.env.WECHAT_TOKEN
    if (!token) {
      console.error('WECHAT_TOKEN not found in environment variables')
      return false
    }
    
    // 1. 将 token、timestamp、nonce 三个参数进行字典序排序
    const tmpArr = [token, timestamp, nonce].sort()
    
    // 2. 将三个参数字符串拼接成一个字符串进行 sha1 加密
    const tmpStr = tmpArr.join('')
    const shasum = crypto.createHash('sha1')
    shasum.update(tmpStr)
    const hash = shasum.digest('hex')
    
    // 3. 开发模式下输出日志便于调试
    console.log('Verification params:', {
      token,
      timestamp,
      nonce,
      signature,
      calculated: hash
    })
    
    // 4. 将加密后的字符串与 signature 对比
    return hash === signature
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

// 生成回复消息
function generateReplyMessage(toUser: string, fromUser: string, content: string) {
  const timestamp = Math.floor(Date.now() / 1000)
  return `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName><![CDATA[${fromUser}]]></FromUserName>
    <CreateTime>${timestamp}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${content}]]></Content>
  </xml>`
}

// 存储登录码和状态
const loginCodes = new Map<string, {
  status: 'pending' | 'success',
  openid?: string
}>();

// 生成随机登录码
function generateLoginCode() {
  return Math.random().toString(36).substring(7).toUpperCase()
}

// 处理公众号消息
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const result = await parseStringPromise(body, { explicitArray: false })
    const message = result.xml

    // 处理不同类型的消息
    switch (message.MsgType) {
      case 'text':
        // 如果是登录码
        if (/^[A-Z0-9]{6}$/.test(message.Content)) {
          const loginCode = message.Content
          const loginInfo = loginCodes.get(loginCode)
          
          if (!loginInfo) {
            const replyMessage = generateReplyMessage(
              message.FromUserName,
              message.ToUserName,
              '登录码无效或已过期，请重新获取。'
            )
            return new NextResponse(replyMessage, {
              headers: { 'Content-Type': 'text/xml' },
            })
          }

          // 更新登录状态
          loginCodes.set(loginCode, {
            status: 'success',
            openid: message.FromUserName
          })

          // 发送登录成功消息
          const replyMessage = generateReplyMessage(
            message.FromUserName,
            message.ToUserName,
            '登录成功！请返回网页继续操作。'
          )
          return new NextResponse(replyMessage, {
            headers: { 'Content-Type': 'text/xml' },
          })
        }
        break

      case 'event':
        if (message.Event === 'subscribe') {
          // 处理关注事件
          const replyMessage = generateReplyMessage(
            message.FromUserName,
            message.ToUserName,
            '感谢关注！请回复登录码完成登录。'
          )
          return new NextResponse(replyMessage, {
            headers: { 'Content-Type': 'text/xml' },
          })
        }
        break
    }

    // 默认回复
    const replyMessage = generateReplyMessage(
      message.FromUserName,
      message.ToUserName,
      '欢迎使用！'
    )
    return new NextResponse(replyMessage, {
      headers: { 'Content-Type': 'text/xml' },
    })
  } catch (error) {
    console.error('处理公众号消息失败:', error)
    return new NextResponse('success', { status: 200 })
  }
}

// 获取登录二维码
export async function PUT(request: NextRequest) {
  try {
    // 生成登录码
    const loginCode = generateLoginCode()
    
    // 存储登录码状态
    loginCodes.set(loginCode, { status: 'pending' })
    
    // 5分钟后自动清除登录码
    setTimeout(() => {
      loginCodes.delete(loginCode)
    }, 5 * 60 * 1000)
    
    return NextResponse.json({ 
      loginCode,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(loginCode)}`
    })
  } catch (error) {
    console.error('获取登录二维码失败:', error)
    return NextResponse.json(
      { error: '获取登录二维码失败' },
      { status: 500 }
    )
  }
}

// 检查登录状态
export async function PATCH(request: NextRequest) {
  try {
    const { loginCode } = await request.json()
    
    if (!loginCode) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const loginInfo = loginCodes.get(loginCode)
    if (!loginInfo) {
      return NextResponse.json(
        { error: '登录码无效或已过期' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      status: loginInfo.status,
      openid: loginInfo.openid
    })
  } catch (error) {
    console.error('检查登录状态失败:', error)
    return NextResponse.json(
      { error: '检查登录状态失败' },
      { status: 500 }
    )
  }
}

// 处理服务器验证
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const signature = searchParams.get('signature')
    const timestamp = searchParams.get('timestamp')
    const nonce = searchParams.get('nonce')
    const echostr = searchParams.get('echostr')

    console.log('Received verification request:', {
      signature,
      timestamp,
      nonce,
      echostr
    })

    if (!signature || !timestamp || !nonce || !echostr) {
      console.error('Missing required parameters')
      return new NextResponse('missing params', { status: 400 })
    }

    const isValid = verifySignature(timestamp, nonce, signature)
    console.log('Signature verification result:', isValid)

    if (isValid) {
      return new NextResponse(echostr)
    } else {
      return new NextResponse('invalid signature', { status: 401 })
    }
  } catch (error) {
    console.error('Verification request failed:', error)
    return new NextResponse('server error', { status: 500 })
  }
} 