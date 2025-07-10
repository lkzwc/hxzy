// R2存储服务实现（不依赖AWS SDK）
export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  endpoint: string;
  publicUrl: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// 生成AWS签名V4
async function generateSignature(
  method: string,
  url: string,
  headers: Record<string, string>,
  payload: string,
  config: R2Config
): Promise<string> {
  const encoder = new TextEncoder();
  
  // 创建规范请求
  const canonicalRequest = [
    method,
    new URL(url).pathname,
    new URL(url).search.slice(1),
    Object.entries(headers)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key.toLowerCase()}:${value}`)
      .join('\n'),
    '',
    Object.keys(headers)
      .sort()
      .map(key => key.toLowerCase())
      .join(';'),
    await sha256(payload)
  ].join('\n');

  // 创建签名字符串
  const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = timestamp.slice(0, 8);
  const credentialScope = `${date}/auto/s3/aws4_request`;
  
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    credentialScope,
    await sha256(canonicalRequest)
  ].join('\n');

  // 计算签名
  const signingKey = await getSignatureKey(config.secretAccessKey, date, 'auto', 's3');
  const signature = await hmacSha256(signingKey, stringToSign);
  
  return signature;
}

// SHA256哈希
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// HMAC-SHA256
async function hmacSha256(key: CryptoKey | Uint8Array, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const messageData = encoder.encode(message);
  
  let cryptoKey: CryptoKey;
  if (key instanceof Uint8Array) {
    cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
  } else {
    cryptoKey = key;
  }
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const signatureArray = Array.from(new Uint8Array(signature));
  return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 获取签名密钥
async function getSignatureKey(
  secretKey: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  
  const kDate = await crypto.subtle.importKey(
    'raw',
    encoder.encode('AWS4' + secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const kDateSig = await crypto.subtle.sign('HMAC', kDate, encoder.encode(dateStamp));
  
  const kRegion = await crypto.subtle.importKey(
    'raw',
    new Uint8Array(kDateSig),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const kRegionSig = await crypto.subtle.sign('HMAC', kRegion, encoder.encode(regionName));
  
  const kService = await crypto.subtle.importKey(
    'raw',
    new Uint8Array(kRegionSig),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const kServiceSig = await crypto.subtle.sign('HMAC', kService, encoder.encode(serviceName));
  
  const kSigning = await crypto.subtle.importKey(
    'raw',
    new Uint8Array(kServiceSig),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  return kSigning;
}

// R2存储服务类
export class R2StorageService {
  private config: R2Config;

  constructor(config: R2Config) {
    this.config = config;
  }

  // 验证配置
  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.config.accountId) errors.push('缺少R2账户ID');
    if (!this.config.accessKeyId) errors.push('缺少R2访问密钥ID');
    if (!this.config.secretAccessKey) errors.push('缺少R2访问密钥');
    if (!this.config.bucketName) errors.push('缺少R2存储桶名称');
    if (!this.config.endpoint) errors.push('缺少R2端点');
    if (!this.config.publicUrl) errors.push('缺少R2公共URL');
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // 上传文件到R2
  async uploadFile(file: File, fileName: string): Promise<UploadResult> {
    try {
      // 验证配置
      const validation = this.validateConfig();
      if (!validation.valid) {
        return {
          success: false,
          error: `R2配置错误: ${validation.errors.join(', ')}`
        };
      }

      // 构建上传URL
      const uploadUrl = `${this.config.endpoint}/${this.config.bucketName}/${fileName}`;
      
      // 准备请求头
      const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
      const headers: Record<string, string> = {
        'Host': new URL(this.config.endpoint).host,
        'X-Amz-Date': timestamp,
        'X-Amz-Content-Sha256': 'UNSIGNED-PAYLOAD',
        'Content-Type': file.type || 'application/octet-stream',
        'Content-Length': file.size.toString()
      };

      // 生成授权头
      const authorization = await this.generateAuthorizationHeader(
        'PUT',
        uploadUrl,
        headers,
        'UNSIGNED-PAYLOAD'
      );
      
      headers['Authorization'] = authorization;

      // 上传文件
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers,
        body: file
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`上传失败: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // 构建公共访问URL
      const publicUrl = `${this.config.publicUrl}/${fileName}`;

      return {
        success: true,
        url: publicUrl
      };
    } catch (error) {
      console.error('R2上传错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '上传失败'
      };
    }
  }

  // 生成授权头
  private async generateAuthorizationHeader(
    method: string,
    url: string,
    headers: Record<string, string>,
    payload: string
  ): Promise<string> {
    const timestamp = headers['X-Amz-Date'];
    const date = timestamp.slice(0, 8);
    const credentialScope = `${date}/auto/s3/aws4_request`;
    
    const signature = await generateSignature(method, url, headers, payload, this.config);
    
    const signedHeaders = Object.keys(headers)
      .sort()
      .map(key => key.toLowerCase())
      .join(';');
    
    return [
      'AWS4-HMAC-SHA256',
      `Credential=${this.config.accessKeyId}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`
    ].join(', ');
  }

  // 删除文件
  async deleteFile(fileName: string): Promise<UploadResult> {
    try {
      const deleteUrl = `${this.config.endpoint}/${this.config.bucketName}/${fileName}`;
      
      const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
      const headers: Record<string, string> = {
        'Host': new URL(this.config.endpoint).host,
        'X-Amz-Date': timestamp,
        'X-Amz-Content-Sha256': 'UNSIGNED-PAYLOAD'
      };

      const authorization = await this.generateAuthorizationHeader(
        'DELETE',
        deleteUrl,
        headers,
        'UNSIGNED-PAYLOAD'
      );
      
      headers['Authorization'] = authorization;

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error(`删除失败: ${response.status} ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('R2删除错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '删除失败'
      };
    }
  }
}
