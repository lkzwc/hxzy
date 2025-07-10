import { writeFile, mkdir, unlink, access } from 'fs/promises'
import { join } from 'path'
import { BaseStorageService } from './base'
import { LocalStorageConfig, UploadResult, DeleteResult } from '@/types/storage'

// 本地存储服务实现
export class LocalStorageService extends BaseStorageService {
  private localConfig: LocalStorageConfig

  constructor(config: LocalStorageConfig) {
    super(config)
    this.localConfig = config
  }

  async uploadFiles(files: File[]): Promise<UploadResult> {
    this.log('info', `开始上传 ${files.length} 个文件到本地存储`)

    // 验证文件
    const validation = this.validateFiles(files)
    if (!validation.valid) {
      this.log('error', '文件验证失败', validation.errors)
      return {
        success: false,
        urls: [],
        errors: validation.errors
      }
    }

    // 确保上传目录存在
    const uploadDir = join(process.cwd(), this.localConfig.uploadDir)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      this.log('error', '创建上传目录失败', error)
      return {
        success: false,
        urls: [],
        errors: ['创建上传目录失败']
      }
    }

    const urls: string[] = []
    const errors: string[] = []

    // 处理每个文件
    for (const file of files) {
      try {
        // 生成唯一文件名
        const fileName = this.generateUniqueFileName(file.name)
        const filePath = join(uploadDir, fileName)

        // 读取文件内容
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 保存文件
        await writeFile(filePath, buffer)

        // 生成公共URL
        const publicUrl = this.getPublicUrl(fileName)
        urls.push(publicUrl)

        this.log('info', `文件上传成功: ${fileName}`)
      } catch (error) {
        const errorMessage = `上传文件 ${file.name} 失败: ${error instanceof Error ? error.message : '未知错误'}`
        this.log('error', errorMessage, error)
        errors.push(errorMessage)
      }
    }

    const success = urls.length > 0
    this.log('info', `本地上传完成: 成功 ${urls.length} 个，失败 ${errors.length} 个`)

    return {
      success,
      urls,
      errors: errors.length > 0 ? errors : undefined
    }
  }

  async deleteFile(url: string): Promise<DeleteResult> {
    return this.deleteFiles([url])
  }

  async deleteFiles(urls: string[]): Promise<DeleteResult> {
    this.log('info', `开始删除 ${urls.length} 个本地文件`)

    const deletedUrls: string[] = []
    const errors: string[] = []

    for (const url of urls) {
      try {
        // 从URL提取文件名
        const fileName = this.extractFileNameFromUrl(url)
        const filePath = join(process.cwd(), this.localConfig.uploadDir, fileName)

        // 检查文件是否存在
        try {
          await access(filePath)
        } catch {
          errors.push(`文件不存在: ${url}`)
          continue
        }

        // 删除文件
        await unlink(filePath)
        deletedUrls.push(url)

        this.log('info', `文件删除成功: ${fileName}`)
      } catch (error) {
        const errorMessage = `删除文件失败 ${url}: ${error instanceof Error ? error.message : '未知错误'}`
        this.log('error', errorMessage, error)
        errors.push(errorMessage)
      }
    }

    const success = deletedUrls.length > 0
    this.log('info', `本地删除完成: 成功 ${deletedUrls.length} 个，失败 ${errors.length} 个`)

    return {
      success,
      deletedUrls,
      errors: errors.length > 0 ? errors : undefined
    }
  }

  getPublicUrl(key: string): string {
    // 确保key不以斜杠开头
    const cleanKey = key.startsWith('/') ? key.substring(1) : key
    
    // 构建完整的公共URL
    const baseUrl = this.localConfig.baseUrl.endsWith('/') 
      ? this.localConfig.baseUrl.slice(0, -1) 
      : this.localConfig.baseUrl
    
    const uploadPath = this.localConfig.uploadDir.replace('public/', '')
    
    return `${baseUrl}/${uploadPath}/${cleanKey}`
  }

  // 从URL提取文件名
  private extractFileNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      return pathParts[pathParts.length - 1]
    } catch {
      // 如果URL解析失败，尝试直接从路径提取
      const parts = url.split('/')
      return parts[parts.length - 1]
    }
  }

  // 获取上传目录的绝对路径
  public getUploadDir(): string {
    return join(process.cwd(), this.localConfig.uploadDir)
  }

  // 检查上传目录是否存在并可写
  public async checkUploadDir(): Promise<{ exists: boolean; writable: boolean; error?: string }> {
    try {
      const uploadDir = this.getUploadDir()
      
      // 尝试创建目录
      await mkdir(uploadDir, { recursive: true })
      
      // 检查是否可写（尝试创建一个临时文件）
      const testFile = join(uploadDir, '.write-test')
      try {
        await writeFile(testFile, 'test')
        await unlink(testFile)
        return { exists: true, writable: true }
      } catch {
        return { exists: true, writable: false, error: '目录不可写' }
      }
    } catch (error) {
      return { 
        exists: false, 
        writable: false, 
        error: error instanceof Error ? error.message : '未知错误' 
      }
    }
  }
}
