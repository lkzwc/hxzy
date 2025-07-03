// 存储类型枚举
export enum StorageType {
  LOCAL = 'local',
  R2 = 'r2'
}

// 存储配置接口
export interface StorageConfig {
  type: StorageType
  maxFileSize: number
  allowedFileTypes: string[]
  maxFilesPerUpload: number
}

// 本地存储配置
export interface LocalStorageConfig extends StorageConfig {
  uploadDir: string
  baseUrl: string
}

// R2 存储配置
export interface R2StorageConfig extends StorageConfig {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  endpoint: string
  publicUrl: string
}

// 文件上传结果
export interface UploadResult {
  success: boolean
  urls: string[]
  errors?: string[]
}

// 文件删除结果
export interface DeleteResult {
  success: boolean
  deletedUrls: string[]
  errors?: string[]
}

// 存储服务接口
export interface StorageService {
  uploadFiles(files: File[]): Promise<UploadResult>
  deleteFile(url: string): Promise<DeleteResult>
  deleteFiles(urls: string[]): Promise<DeleteResult>
  getPublicUrl(key: string): string
}

// 文件信息
export interface FileInfo {
  originalName: string
  fileName: string
  size: number
  type: string
  url: string
}
