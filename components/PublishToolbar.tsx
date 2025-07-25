"use client";

import React, { useState } from "react";
import { Image as AntImage, message } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

export interface ImageUploadProps {
  /** 上传场景类型 */
  type: "post" | "comment" | "avatar";
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
  remainingChars?: number;
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

export default function PublishToolbar({
  type,
  value = [],
  remainingChars = 0,
  onChange,
  maxCount,
  disabled = false,
  className = "",
  showUploadButton = true,
  showPreviewOnly = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // 获取场景配置
  const config = SCENE_CONFIG[type];
  const finalMaxCount = maxCount ?? config.maxCount;

  // 文件上传前的验证
  const beforeUpload = (file: File) => {
    // 检查文件类型
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      messageApi.error("只能上传图片文件！");
      return false;
    }

    // 检查文件大小 (5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      messageApi.error("图片大小不能超过5MB！");
      return false;
    }

    return true;
  };

  // 处理文件选择（支持 Blob 上传）
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files?.length) return;

    const fileArray = Array.from(files);

    // 检查总数量限制
    if (value.length + fileArray.length > finalMaxCount) {
      messageApi.error(
        `最多只能上传${finalMaxCount}张图片！当前已有${value.length}张，最多还能上传${finalMaxCount - value.length}张`
      );
      event.target.value = "";
      return;
    }

    // 批量上传文件
    setUploading(true);
    const formData = new FormData();

    // 验证所有文件
    for (const file of fileArray) {
      if (!beforeUpload(file)) {
        setUploading(false);
        event.target.value = "";
        return;
      }
      formData.append("files", file);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "上传失败");
      }

      const data = await response.json();

      if (data.urls && Array.isArray(data.urls)) {
        const newUrls = [...value, ...data.urls];
        onChange?.(newUrls);
        messageApi.success(`成功上传${data.urls.length}张图片！`);
      } else {
        throw new Error("服务器返回数据格式错误");
      }
    } catch (error) {
      console.error("Upload error:", error);
      messageApi.error(
        error instanceof Error ? error.message : "上传失败，请重试"
      );
    } finally {
      setUploading(false);
    }

    // 清空 input 值，允许重复选择同一文件
    event.target.value = "";
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

  // 渲染图片预览区域
  const renderImagePreview = () => {
    if (value.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((url, index) => (
          <div key={index} className="relative group">
            <div
              className={`${
                type === "avatar"
                  ? "w-20 h-20"
                  : type === "comment"
                    ? "w-16 h-16"
                    : "w-16 h-16 sm:w-20 sm:h-20"
              } rounded-lg overflow-hidden border border-gray-200 flex-shrink-0`}
            >
              <img
                src={url}
                alt={`上传图片 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 操作按钮 */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
              <button
                onClick={() => handlePreview(url)}
                className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                title="预览"
              >
                <EyeOutlined className="text-white text-xs" />
              </button>

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
    );
  };

  // 渲染上传按钮
  const renderUploadButton = () => {
    if (showPreviewOnly || !showUploadButton) return null;

    if (value.length >= finalMaxCount) {
      return (
        <span
          className="inline-flex items-center justify-center p-2 text-gray-300 cursor-not-allowed"
          title={`已达到最大上传数量 ${finalMaxCount}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      );
    }

    return (
      <label
        className={`inline-flex items-center justify-center p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors cursor-pointer relative ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          type="file"
          accept="image/*"
          multiple={type === "post"}
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-full">
            <div className="w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </label>
    );
  };

  return (
    <div className={`image-upload ${className}`}>
      {contextHolder}

      {/* 图片预览弹窗 */}
      <AntImage
        style={{ display: "none" }}
        src={previewImage}
        preview={{
          visible: previewVisible,
          onVisibleChange: setPreviewVisible,
        }}
      />

      {/* 图片预览区域 - 放在上传按钮上方 */}
      {renderImagePreview()}

      <div className="flex items-center gap-2">
        {/* 上传按钮 */}
        {renderUploadButton()}

        {/* 其他功能按钮占位 */}
        {type === "post" && (
          <>
            {" "}
            <button
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              title="视频"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </button>
            <button
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              title="附件"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              title="表情"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              title="可见性"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* 字符计数 */}
            <span
              className={`text-sm font-medium ${
                remainingChars < 20
                  ? "text-red-500"
                  : remainingChars < 0
                    ? "text-red-600"
                    : "text-gray-500"
              }`}
            >
              {remainingChars}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
