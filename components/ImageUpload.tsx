"use client";

import React, { useState } from 'react';
import { message, Image as AntImage } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';

export interface ImageUploadProps {
  /** 上传场景类型 */
  type: 'post' | 'comment' | 'avatar' | 'attachment';
  /** 当前图片列表 */
  value?: string[];
  /** 图片变化回调 */
  onChange?: (urls: string[]) => void;
  /** 最大上传数量 */
  maxCount?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 上传提示文字 */
  uploadText?: string;
  /** 是否显示预览 */
  showPreview?: boolean;
  /** 是否支持拖拽上传 */
  dragger?: boolean;
  /** 紧凑模式 - 只显示上传按钮 */
  compact?: boolean;
}

// 不同场景的默认配置
const SCENE_CONFIG = {
  post: {
    maxCount: 6,
    uploadText: '上传图片',
    showPreview: true,
    listType: 'picture-card' as const,
  },
  comment: {
    maxCount: 1,
    uploadText: '添加图片',
    showPreview: true,
    listType: 'picture-card' as const,
  },
  avatar: {
    maxCount: 1,
    uploadText: '上传头像',
    showPreview: true,
    listType: 'picture-card' as const,
  },
  attachment: {
    maxCount: 5,
    uploadText: '上传附件',
    showPreview: true,
    listType: 'picture-card' as const,
  },
};

export default function ImageUpload({
  type,
  value = [],
  onChange,
  maxCount,
  disabled = false,
  className = '',
  showPreview = true,
  compact = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 获取场景配置
  const config = SCENE_CONFIG[type];
  const finalMaxCount = maxCount ?? config.maxCount;

  // 文件上传前的验证
  const beforeUpload = (file: File) => {
    // 检查文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    // 检查文件大小 (5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过5MB！');
      return false;
    }

    // 检查数量限制
    if (value.length >= finalMaxCount) {
      message.error(`最多只能上传${finalMaxCount}张图片！`);
      return false;
    }

    return true;
  };

  // 处理文件上传
  const handleUpload = async (file: File) => {
    if (!beforeUpload(file)) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传失败');
      }

      const data = await response.json();
      
      if (data.urls && Array.isArray(data.urls)) {
        const newUrls = [...value, ...data.urls];
        onChange?.(newUrls);
        message.success('上传成功！');
      } else {
        throw new Error('服务器返回数据格式错误');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error instanceof Error ? error.message : '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 处理文件选择（支持 Blob 上传）
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    // 处理多个文件
    Array.from(files).forEach(file => {
      handleUpload(file);
    });

    // 清空 input 值，允许重复选择同一文件
    event.target.value = '';
  };

  // 删除图片
  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange?.(newUrls);
  };

  // 预览图片
  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };





  // 紧凑模式只显示上传按钮
  if (compact) {
    return (
      <>
        {value.length < finalMaxCount && (
          <label className={`p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors cursor-pointer relative ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input
              type="file"
              accept="image/*"
              multiple={type === 'post'}
              onChange={handleFileSelect}
              disabled={disabled || uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-full">
                <div className="w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </label>
        )}

        {/* 图片预览 */}
        {showPreview && (
          <AntImage
            style={{ display: 'none' }}
            src={previewImage}
            preview={{
              visible: previewVisible,
              onVisibleChange: setPreviewVisible,
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className={`image-upload ${className}`}>
      {/* 图片和上传按钮的容器 */}
      <div className="flex flex-wrap gap-2">
        {/* 已上传的图片 */}
        {value.map((url, index) => (
          <div key={index} className="relative group">
            <div className={`${
              type === 'avatar' ? 'w-20 h-20' :
              type === 'comment' ? 'w-16 h-16' :
              'w-16 h-16 sm:w-20 sm:h-20'
            } rounded-lg overflow-hidden border border-gray-200 flex-shrink-0`}>
              <img
                src={url}
                alt={`上传图片 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 操作按钮 */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
              {showPreview && (
                <button
                  onClick={() => handlePreview(url)}
                  className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                  title="预览"
                >
                  <EyeOutlined className="text-white text-xs" />
                </button>
              )}

              {!disabled && (
                <button
                  onClick={() => handleRemove(index)}
                  className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                  title="删除"
                >
                  <DeleteOutlined className="text-white text-xs" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* 上传按钮 */}
        {value.length < finalMaxCount && (
          <label className={`${
            type === 'avatar' ? 'w-20 h-20' :
            type === 'comment' ? 'w-16 h-16' :
            'w-16 h-16 sm:w-20 sm:h-20'
          } flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100 relative ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input
              type="file"
              accept="image/*"
              multiple={type === 'post'}
              onChange={handleFileSelect}
              disabled={disabled || uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <svg className="w-4 h-4 text-gray-400 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {type !== 'comment' && (
              <span className="text-xs text-gray-500 text-center leading-tight">
                {type === 'post' ? '添加图片' : '上传'}
              </span>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </label>
        )}
      </div>

      {/* 图片预览 */}
      {showPreview && (
        <AntImage
          style={{ display: 'none' }}
          src={previewImage}
          preview={{
            visible: previewVisible,
            onVisibleChange: setPreviewVisible,
          }}
        />
      )}

      {/* 上传提示 */}
      {value.length === 0 && type === 'post' && (
        <div className="mt-2 text-xs text-gray-500">
          最多上传{finalMaxCount}张图片，支持JPG、PNG、WebP格式，单张不超过5MB
        </div>
      )}
    </div>
  );
}
