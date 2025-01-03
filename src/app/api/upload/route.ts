import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

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

    const urls: string[] = []
    for (const file of files) {
      // 生成唯一的文件名
      const bytes = new Uint8Array(8)
      crypto.getRandomValues(bytes)
      const uniqueId = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
      const fileName = `${uniqueId}-${file.name}`

      // 确保文件是图片
      if (!file.type.startsWith('image/')) {
        continue
      }

      // 读取文件内容
      const bytes2 = await file.arrayBuffer()
      const buffer = Buffer.from(bytes2)

      // 保存文件
      const path = join(process.cwd(), 'public/uploads', fileName)
      await writeFile(path, buffer)

      // 添加到 URL 列表
      urls.push(`/uploads/${fileName}`)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    )
  }
} 