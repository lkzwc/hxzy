import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";


// 存储登录状态的Map
const loginStateMap = new Map<string, {
    status: 'pending' | 'scanned' | 'authorized',
    openid?: string
  }>()

// 验证消息签名
function verifySignature(
  timestamp: string,
  nonce: string,
  signature: string
): boolean {
  try {
    const token = process.env.WECHAT_TOKEN;
    if (!token) {
      console.error("WECHAT_TOKEN not found in environment variables");
      return false;
    }

    // 1. 将 token、timestamp、nonce 三个参数进行字典序排序
    const tmpArr = [token, timestamp, nonce].sort();

    // 2. 将三个参数字符串拼接成一个字符串进行 sha1 加密
    const tmpStr = tmpArr.join("");
    const shasum = crypto.createHash("sha1");
    shasum.update(tmpStr);
    const hash = shasum.digest("hex");

    // 3. 开发模式下输出日志便于调试
    console.log("Verification params:", {
      token,
      timestamp,
      nonce,
      signature,
      calculated: hash,
    });

    // 4. 将加密后的字符串与 signature 对比
    return hash === signature;
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

// 生成回复消息
function generateReplyMessage(
  toUser: string,
  fromUser: string,
  content: string
) {
  const timestamp = Math.floor(Date.now() / 1000);
  return `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName><![CDATA[${fromUser}]]></FromUserName>
    <CreateTime>${timestamp}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${content}]]></Content>
  </xml>`;
}

async function getAccessToken() {
  const appId = process.env.WECHAT_APP_ID;
  const appSecret = process.env.WECHAT_APP_SECRET;
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.access_token;
}

// 处理公众号消息
export async function POST(request: NextRequest) {
    // 判断是微信服务器推送还是前端请求
    try {
        const accessToken = await getAccessToken()
        
        // 生成唯一的场景值作为登录标识
        const sceneStr = `login_${Date.now()}_${Math.random().toString(36).slice(2)}`
        
        // 创建二维码ticket
        const response = await fetch(
          `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`,
          {
            method: 'POST',
            body: JSON.stringify({
              expire_seconds: 300, // 5分钟有效期
              action_name: 'QR_STR_SCENE',
              action_info: {
                scene: { scene_str: sceneStr }
              }
            })
          }
        )
    
        if (!response.ok) {
          throw new Error('获取二维码ticket失败')
        }
    
        const { ticket, expire_seconds } = await response.json()
        
        // 初始化登录状态
        loginStateMap.set(sceneStr, { status: 'pending' })
        
        // 5分钟后清除登录状态
        setTimeout(() => {
          loginStateMap.delete(sceneStr)
        }, 300 * 1000)
    
        return NextResponse.json({
          sceneStr,
          loginCode:ticket,
          expireSeconds: expire_seconds,
          qrCodeUrl: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(ticket)}`
        })
      } catch (error) {
        console.error('生成登录二维码失败:', error)
        return NextResponse.json(
          { error: '生成登录二维码失败' },
          { status: 500 }
        )
      }
}
// 检查登录状态
export async function PATCH(request: NextRequest) {
  try {
    const { loginCode } = await request.json();

    if (!loginCode) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    const loginInfo = loginCodes.get(loginCode);
    if (!loginInfo) {
      return NextResponse.json(
        { error: "登录码无效或已过期" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: loginInfo.status,
      openid: loginInfo.openid,
    });
  } catch (error) {
    console.error("检查登录状态失败:", error);
    return NextResponse.json({ error: "检查登录状态失败" }, { status: 500 });
  }
}

// 处理服务器验证
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const signature = searchParams.get("signature");
    const timestamp = searchParams.get("timestamp");
    const nonce = searchParams.get("nonce");
    const echostr = searchParams.get("echostr");

    console.log("Received verification request:", {
      signature,
      timestamp,
      nonce,
      echostr,
    });

    if (!signature || !timestamp || !nonce || !echostr) {
      console.error("Missing required parameters");
      return new NextResponse("missing params", { status: 400 });
    }

    const isValid = verifySignature(timestamp, nonce, signature);

    if (isValid) {
      return new NextResponse(echostr);
    } else {
      return new NextResponse("invalid signature", { status: 401 });
    }
  } catch (error) {
    console.error("Verification request failed:", error);
    return new NextResponse("server error", { status: 500 });
  }
}
