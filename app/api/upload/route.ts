import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/auth'

// 存储类型
type StorageType = 'local' | 'r2'

// 配置
const STORAGE_TYPE = (process.env.STORAGE_TYPE as StorageType) || 'local'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// R2配置
const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucketName: process.env.R2_BUCKET_NAME,
  endpoint: process.env.R2_ENDPOINT,
  publicUrl: process.env.R2_PUBLIC_URL,
}

// 生成唯一文件名
function generateFileName(originalName: string): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  const uniqueId = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  const ext = originalName.split('.').pop() || 'jpg'
  const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '').split('.')[0]
  return `${Date.now()}-${uniqueId}-${cleanName}.${ext}`
}

// 验证文件
function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: '不支持的文件类型，请上传JPG、PNG、WebP或GIF格式的图片' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '文件大小不能超过5MB' }
  }

  return { valid: true }
}

// 本地存储上传
async function uploadToLocal(file: File): Promise<string> {
  const fileName = generateFileName(file.name)
  const uploadDir = join(process.cwd(), 'public/uploads')

  // 确保上传目录存在
  await mkdir(uploadDir, { recursive: true })

  // 读取文件内容
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // 保存文件
  const filePath = join(uploadDir, fileName)
  await writeFile(filePath, buffer)

  return `/uploads/${fileName}`
}

// R2存储上传
async function uploadToR2(file: File): Promise<string> {
  if (!R2_CONFIG.accountId || !R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey || !R2_CONFIG.bucketName) {
    throw new Error('R2配置不完整')
  }

  const { R2StorageService } = await import('@/lib/storage/r2')

  const r2Service = new R2StorageService({
    accountId: R2_CONFIG.accountId,
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
    bucketName: R2_CONFIG.bucketName,
    endpoint: R2_CONFIG.endpoint || '',
    publicUrl: R2_CONFIG.publicUrl || '',
  })

  const fileName = generateFileName(file.name)
  const result = await r2Service.uploadFile(file, fileName)

  if (!result.success) {
    throw new Error(result.error || 'R2上传失败')
  }

  return result.url || ''
}

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
        { error: '请选择要上传的文件' },
        { status: 400 }
      )
    }

    // 验证文件数量限制
    if (files.length > 6) {
      return NextResponse.json(
        { error: '一次最多只能上传6个文件' },
        { status: 400 }
      )
    }

    const urls: string[] = []
    const errors: string[] = []

    for (const file of files) {
      try {
        // 验证文件
        const validation = validateFile(file)
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`)
          continue
        }

        // 根据配置选择存储方式
        let url: string
        if (STORAGE_TYPE === 'r2') {
          url = await uploadToR2(file)
        } else {
          url = await uploadToLocal(file)
        }

        urls.push(url)
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error)
        errors.push(`${file.name}: 上传失败`)
      }
    }

    // 如果没有成功上传任何文件
    if (urls.length === 0) {
      return NextResponse.json(
        { error: errors.length > 0 ? errors.join('; ') : '没有成功上传任何文件' },
        { status: 400 }
      )
    }

    // 返回结果
    const response: any = { urls }
    if (errors.length > 0) {
      response.warnings = errors
    }

    console.log('Successfully uploaded files:', urls)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: '上传失败，请重试' },
      { status: 500 }
    )
  }
}