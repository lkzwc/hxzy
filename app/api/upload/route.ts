import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/auth'

export async function POST(request: Request) {
  try {
    // 检查用户是否登录
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files.length) {
      return NextResponse.json(
        { error: '请选择要上传的图片' },
        { status: 400 }
      )
    }

    // 确保上传目录存在
    const uploadDir = join(process.cwd(), 'public/uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      console.error('Error creating upload directory:', err)
    }

    const urls: string[] = []
    for (const file of files) {
      // 生成唯一的文件名
      const bytes = new Uint8Array(8)
      crypto.getRandomValues(bytes)
      const uniqueId = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
      const fileName = `${uniqueId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

      // 确保文件是图片
      if (!file.type.startsWith('image/')) {
        console.warn(`Skipping non-image file: ${file.name} (${file.type})`)
        continue
      }

      // 读取文件内容
      const bytes2 = await file.arrayBuffer()
      const buffer = Buffer.from(bytes2)

      try {
        // 保存文件
        const path = join(uploadDir, fileName)
        await writeFile(path, buffer)
        console.log(`File saved successfully: ${path}`)

        // 添加到 URL 列表
        urls.push(`/uploads/${fileName}`)
      } catch (err) {
        console.error('Error saving file:', err || 'Unknown error')
        return NextResponse.json(
          { error: '保存文件失败，请重试' },
          { status: 500 }
        )
      }
    }

    if (urls.length === 0) {
      return NextResponse.json(
        { error: '没有成功上传任何图片' },
        { status: 400 }
      )
    }

    console.log('Successfully uploaded files, returning URLs:', urls)
    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Error uploading files:', error || 'Unknown error')
    return NextResponse.json(
      { error: '上传失败，请重试' },
      { status: 500 }
    )
  }
} 