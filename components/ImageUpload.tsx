"use client";

import React, { useState } from 'react';
import { messageApi, Image as AntImage, message } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';

export interface ImageUploadProps {
  /** 上传场景类型 */
  type: 'post' | 'comment' | 'avatar';
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
  /** 是否显示预览 */
  showPreview?: boolean;
  /** 是否显示上传按钮 */
  showUploadButton?: boolean;
  /** 只显示预览，不显示上传按钮 */
  showPreviewOnly?: boolean;
}

// 不同场景的默认配置
const SCENE_CONFIG = {
  post: {
    maxCount: 6,
  },
  comment: {
    maxCount: 1,
  },
  avatar: {
    maxCount: 1,
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
  showUploadButton = true,
  showPreviewOnly = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  // 获取场景配置
  const config = SCENE_CONFIG[type];
  const finalMaxCount = maxCount ?? config.maxCount;

  // 文件上传前的验证
  const beforeUpload = (file: File) => {
    // 检查文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      messageApi.error('只能上传图片文件！');
      return false;
    }

    // 检查文件大小 (5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      messageApi.error('图片大小不能超过5MB！');
      return false;
    }

    return true;
  };



  // 处理文件选择（支持 Blob 上传）
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const fileArray = Array.from(files);

    // 检查总数量限制
    if (value.length + fileArray.length > finalMaxCount) {
      messageApi.error(`最多只能上传${finalMaxCount}张图片！当前已有${value.length}张，最多还能上传${finalMaxCount - value.length}张`);
      event.target.value = '';
      return;
    }

    // 批量上传文件
    setUploading(true);
    const formData = new FormData();

    // 验证所有文件
    for (const file of fileArray) {
      if (!beforeUpload(file)) {
        setUploading(false);
        event.target.value = '';
        return;
      }
      formData.append('files', file);
    }

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
        messageApi.success(`成功上传${data.urls.length}张图片！`);
      } else {
        throw new Error('服务器返回数据格式错误');
      }
    } catch (error) {
      console.error('Upload error:', error);
      messageApi.error(error instanceof Error ? error.message : '上传失败，请重试');
    } finally {
      setUploading(false);
    }

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





  // 如果只显示预览，不显示上传按钮
  if (showPreviewOnly) {
    return (
      <div className={`image-upload ${className}`}>
        {/* 图片预览区域 */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
          </div>
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
      </div>
    );
  }

  return (
    <div className={`image-upload ${className}`}>
          {contextHolder}
      {/* 紧凑的上传按钮 */}
      {showUploadButton && value.length < finalMaxCount && (
        <label className={`inline-flex items-center justify-center p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors cursor-pointer relative ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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

      {/* 达到上限时的提示 */}
      {showUploadButton && value.length >= finalMaxCount && (
        <span className="inline-flex items-center justify-center p-2 text-gray-300 cursor-not-allowed" title={`已达到最大上传数量 ${finalMaxCount}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </span>
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
    </div>
  );
}
