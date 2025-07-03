import { StorageService, UploadResult, DeleteResult, FileInfo, StorageConfig } from '@/types/storage'

// 存储服务抽象基类
export abstract class BaseStorageService implements StorageService {
  protected config: StorageConfig

  constructor(config: StorageConfig) {
    this.config = config
  }

  // 抽象方法，子类必须实现
  abstract uploadFiles(files: File[]): Promise<UploadResult>
  abstract deleteFile(url: string): Promise<DeleteResult>
  abstract deleteFiles(urls: string[]): Promise<DeleteResult>
  abstract getPublicUrl(key: string): string

  // 通用文件验证方法
  protected validateFile(file: File): { valid: boolean; error?: string } {
    // 检查文件大小
    if (file.size > this.config.maxFileSize) {
      return {
        valid: false,
        error: `文件 ${file.name} 大小超过限制 (${this.formatFileSize(this.config.maxFileSize)})`
      }
    }

    // 检查文件类型
    if (!this.config.allowedFileTypes.includes(file.type)) {
      return {
        valid: false,
        error: `文件 ${file.name} 类型不支持 (${file.type})`
      }
    }

    return { valid: true }
  }

  // 验证多个文件
  protected validateFiles(files: File[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // 检查文件数量
    if (files.length > this.config.maxFilesPerUpload) {
      errors.push(`一次最多只能上传 ${this.config.maxFilesPerUpload} 个文件`)
      return { valid: false, errors }
    }

    // 验证每个文件
    for (const file of files) {
      const validation = this.validateFile(file)
      if (!validation.valid && validation.error) {
        errors.push(validation.error)
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // 生成唯一文件名
  protected generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split('.').pop()
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '')
    
    return `${timestamp}-${random}-${nameWithoutExt}.${extension}`
  }

  // 格式化文件大小
  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 从URL提取文件键名
  protected extractKeyFromUrl(url: string): string {
    // 移除域名和协议，只保留路径
    const urlObj = new URL(url)
    return urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname
  }

  // 创建文件信息对象
  protected createFileInfo(file: File, fileName: string, url: string): FileInfo {
    return {
      originalName: file.name,
      fileName,
      size: file.size,
      type: file.type,
      url
    }
  }

  // 记录日志的辅助方法
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] [Storage] ${message}`
    
    if (data) {
      console[level](logMessage, data)
    } else {
      console[level](logMessage)
    }
  }
}
