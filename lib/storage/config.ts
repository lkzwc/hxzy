import { StorageType, StorageConfig, LocalStorageConfig, R2StorageConfig } from '@/types/storage'

// 存储配置管理器
export class StorageConfigManager {
  private static instance: StorageConfigManager
  private config: StorageConfig

  private constructor() {
    this.config = this.loadConfig()
  }

  public static getInstance(): StorageConfigManager {
    if (!StorageConfigManager.instance) {
      StorageConfigManager.instance = new StorageConfigManager()
    }
    return StorageConfigManager.instance
  }

  private loadConfig(): StorageConfig {
    const storageType = (process.env.STORAGE_TYPE as StorageType) || StorageType.LOCAL
    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB
    const allowedFileTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(',')
    const maxFilesPerUpload = parseInt(process.env.MAX_FILES_PER_UPLOAD || '9')

    const baseConfig = {
      type: storageType,
      maxFileSize,
      allowedFileTypes,
      maxFilesPerUpload
    }

    if (storageType === StorageType.LOCAL) {
      return {
        ...baseConfig,
        uploadDir: process.env.LOCAL_UPLOAD_DIR || 'public/uploads',
        baseUrl: process.env.LOCAL_BASE_URL || 'http://localhost:3000'
      } as LocalStorageConfig
    } else {
      return {
        ...baseConfig,
        accountId: process.env.R2_ACCOUNT_ID || '',
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        bucketName: process.env.R2_BUCKET_NAME || '',
        endpoint: process.env.R2_ENDPOINT || '',
        publicUrl: process.env.R2_PUBLIC_URL || ''
      } as R2StorageConfig
    }
  }

  public getConfig(): StorageConfig {
    return this.config
  }

  public getStorageType(): StorageType {
    return this.config.type
  }

  public isLocalStorage(): boolean {
    return this.config.type === StorageType.LOCAL
  }

  public isR2Storage(): boolean {
    return this.config.type === StorageType.R2
  }

  public getLocalConfig(): LocalStorageConfig {
    if (!this.isLocalStorage()) {
      throw new Error('当前配置不是本地存储')
    }
    return this.config as LocalStorageConfig
  }

  public getR2Config(): R2StorageConfig {
    if (!this.isR2Storage()) {
      throw new Error('当前配置不是R2存储')
    }
    return this.config as R2StorageConfig
  }

  // 验证配置是否完整
  public validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (this.config.maxFileSize <= 0) {
      errors.push('最大文件大小必须大于0')
    }

    if (this.config.allowedFileTypes.length === 0) {
      errors.push('必须指定允许的文件类型')
    }

    if (this.config.maxFilesPerUpload <= 0) {
      errors.push('每次上传的最大文件数必须大于0')
    }

    if (this.isLocalStorage()) {
      const localConfig = this.config as LocalStorageConfig
      if (!localConfig.uploadDir) {
        errors.push('本地存储必须指定上传目录')
      }
      if (!localConfig.baseUrl) {
        errors.push('本地存储必须指定基础URL')
      }
    } else if (this.isR2Storage()) {
      const r2Config = this.config as R2StorageConfig
      if (!r2Config.accountId) errors.push('R2存储必须指定账户ID')
      if (!r2Config.accessKeyId) errors.push('R2存储必须指定访问密钥ID')
      if (!r2Config.secretAccessKey) errors.push('R2存储必须指定访问密钥')
      if (!r2Config.bucketName) errors.push('R2存储必须指定存储桶名称')
      if (!r2Config.endpoint) errors.push('R2存储必须指定端点')
      if (!r2Config.publicUrl) errors.push('R2存储必须指定公共URL')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // 重新加载配置（用于动态配置更新）
  public reloadConfig(): void {
    this.config = this.loadConfig()
  }
}

// 导出单例实例
export const storageConfig = StorageConfigManager.getInstance()
