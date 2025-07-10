"use client";

import { useState } from 'react';
import { Card, Divider, Button, message } from 'antd';
import ImageUpload from '@/components/ImageUpload';

export default function TestUploadPage() {
  const [postImages, setPostImages] = useState<string[]>([]);
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const [avatarImages, setAvatarImages] = useState<string[]>([]);
  const [attachmentImages, setAttachmentImages] = useState<string[]>([]);

  const handleReset = () => {
    setPostImages([]);
    setCommentImages([]);
    setAvatarImages([]);
    setAttachmentImages([]);
    message.success('已重置所有图片');
  };

  const handleSubmit = () => {
    const data = {
      postImages,
      commentImages,
      avatarImages,
      attachmentImages,
    };
    console.log('提交数据:', data);
    message.success('数据已输出到控制台');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-4">
            📸 图片上传组件测试
          </h1>
          <p className="text-lg text-neutral-600">
            测试不同场景下的图片上传功能，支持本地存储和R2云存储
          </p>
        </div>

        {/* 发帖场景 */}
        <Card 
          title="📝 发帖场景 (最多6张)" 
          className="mb-6"
          extra={<span className="text-sm text-gray-500">当前: {postImages.length}/6</span>}
        >
          <ImageUpload
            type="post"
            value={postImages}
            onChange={setPostImages}
            uploadText="上传帖子图片"
          />
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">功能特点：</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 最多上传6张图片</li>
              <li>• 支持多选文件</li>
              <li>• 网格布局显示</li>
              <li>• 支持预览和删除</li>
              <li>• 支持拖拽上传</li>
            </ul>
          </div>
        </Card>

        {/* 评论场景 */}
        <Card 
          title="💬 评论场景 (最多1张)" 
          className="mb-6"
          extra={<span className="text-sm text-gray-500">当前: {commentImages.length}/1</span>}
        >
          <ImageUpload
            type="comment"
            value={commentImages}
            onChange={setCommentImages}
            uploadText="添加评论图片"
          />
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">功能特点：</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 最多上传1张图片</li>
              <li>• 单选文件</li>
              <li>• 紧凑布局</li>
              <li>• 快速上传</li>
            </ul>
          </div>
        </Card>

        {/* 头像场景 */}
        <Card 
          title="👤 头像场景 (最多1张)" 
          className="mb-6"
          extra={<span className="text-sm text-gray-500">当前: {avatarImages.length}/1</span>}
        >
          <ImageUpload
            type="avatar"
            value={avatarImages}
            onChange={setAvatarImages}
            uploadText="上传头像"
          />
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">功能特点：</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 最多上传1张图片</li>
              <li>• 建议1:1比例</li>
              <li>• 圆形预览</li>
              <li>• 适合头像使用</li>
            </ul>
          </div>
        </Card>

        {/* 附件场景 */}
        <Card 
          title="📎 附件场景 (最多5张)" 
          className="mb-6"
          extra={<span className="text-sm text-gray-500">当前: {attachmentImages.length}/5</span>}
        >
          <ImageUpload
            type="attachment"
            value={attachmentImages}
            onChange={setAttachmentImages}
            uploadText="上传附件"
          />
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">功能特点：</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 最多上传5张图片</li>
              <li>• 支持多种格式</li>
              <li>• 列表式显示</li>
              <li>• 适合文档附件</li>
            </ul>
          </div>
        </Card>

        {/* 技术特性说明 */}
        <Card title="🔧 技术特性" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-primary-700">📤 上传功能</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>多存储支持：</strong>本地存储 + Cloudflare R2</li>
                <li>• <strong>文件验证：</strong>类型、大小、数量限制</li>
                <li>• <strong>Blob上传：</strong>支持直接上传Blob对象</li>
                <li>• <strong>进度反馈：</strong>上传状态和错误提示</li>
                <li>• <strong>批量上传：</strong>支持多文件同时上传</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-secondary-700">🎨 界面特性</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>响应式设计：</strong>适配不同屏幕尺寸</li>
                <li>• <strong>预览功能：</strong>图片预览和放大查看</li>
                <li>• <strong>拖拽上传：</strong>支持拖拽文件上传</li>
                <li>• <strong>删除功能：</strong>可单独删除已上传图片</li>
                <li>• <strong>状态提示：</strong>上传中、成功、失败状态</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 配置说明 */}
        <Card title="⚙️ 环境配置" className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">环境变量配置：</h4>
            <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
{`# 存储类型配置
STORAGE_TYPE=local  # 或 r2

# 本地存储配置
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_BASE_URL=http://localhost:3000

# Cloudflare R2 配置
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=hxzy
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-domain.com

# 文件限制配置
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif
MAX_FILES_PER_UPLOAD=6`}
            </pre>
          </div>
        </Card>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={handleReset}
            size="large"
            className="px-8"
          >
            🗑️ 重置所有
          </Button>
          
          <Button 
            type="primary"
            onClick={handleSubmit}
            size="large"
            className="px-8 bg-primary-600 hover:bg-primary-700"
          >
            📤 提交测试
          </Button>
        </div>

        {/* 返回链接 */}
        <div className="text-center">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-white text-primary-600 rounded-xl hover:bg-primary-50 transition-colors font-medium shadow-lg border border-primary-200"
          >
            🏠 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
