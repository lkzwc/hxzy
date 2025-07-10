
"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  PictureOutlined,
  CloseOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Avatar, message, Form, Mentions } from "antd";
import { POST_CONSTANTS } from "@/util/common";

interface TwitterStylePostComposerProps {
  onSuccess?: () => void;
  placeholder?: string;
  className?: string;
}

const MAX_CHARS = POST_CONSTANTS.MAX_CONTENT_LENGTH;
const MAX_IMAGES = POST_CONSTANTS.MAX_IMAGES_TWITTER_STYLE;

export default function TwitterStylePostComposer({
  onSuccess,
  placeholder = "有什么新鲜事？",
  className = "",
}: TwitterStylePostComposerProps) {
  const [form] = Form.useForm();
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const content = Form.useWatch('content', form) || '';
  const remainingChars = MAX_CHARS - content.length;

  // 预设标签选项 - 用于 Mentions 组件
  const tagOptions = [
    { value: "中医", label: "中医" },
    { value: "养生保健", label: "养生保健" },
    { value: "祝由术", label: "祝由术" },
    { value: "跳蚤市场", label: "跳蚤市场" },
    { value: "经验分享", label: "经验分享" },
    { value: "问诊咨询", label: "问诊咨询" },
    { value: "针灸推拿", label: "针灸推拿" },
    { value: "药膳食疗", label: "药膳食疗" },
  ];

  // 从内容中提取标签
  const extractTagsFromContent = (text: string) => {
    console.log('Extracting tags from text:', text);

    // 匹配 #标签 格式 - 支持中文和英文
    const hashTagRegex = /#([a-zA-Z\u4e00-\u9fa5]+)/g;
    const matches = text.match(hashTagRegex);
    const tags = matches ? matches.map(tag => tag.substring(1)) : [];

    console.log('Extracted tags:', tags);
    return tags;
  };



  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > MAX_IMAGES) {
      messageApi.warning(`最多只能上传${MAX_IMAGES}张图片`);
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      messageApi.loading("正在上传图片...", 0);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      messageApi.destroy(); // 清除loading消息

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "上传失败");
      }

      const data = await response.json();
      console.log("Upload response:", data); // 调试信息

      if (data.urls && Array.isArray(data.urls)) {
        setImages(prev => {
          const newImages = [...prev, ...data.urls];
          console.log("Updated images:", newImages); // 调试信息
          return newImages;
        });
        messageApi.success(`成功上传${data.urls.length}张图片`);
      } else {
        throw new Error("服务器返回的数据格式错误");
      }
    } catch (error) {
      messageApi.destroy(); // 清除loading消息
      console.error("Error uploading images:", error);
      messageApi.error(error instanceof Error ? error.message : "图片上传失败，请重试");
    }

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { content } = values;

      if (!session?.user) {
        router.push("/login");
        return;
      }

      if (!content?.trim()) {
        messageApi.warning("请输入内容");
        return;
      }

      // 从内容中提取最新的标签
      const finalTags = extractTagsFromContent(content);

      // 如果没有标签，给出提示但仍允许发布
      if (finalTags.length === 0) {
        messageApi.info("建议添加标签（使用#号）以便其他用户发现您的内容");
      }

      setIsSubmitting(true);

      const postData = {
        content: content.trim(),
        tags: finalTags,
        images,
      };

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "发布失败");
      }

      messageApi.success("发布成功！");

      // 重置表单
      form.resetFields();
      setImages([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      messageApi.error(error instanceof Error ? error.message : "发布失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPostDisabled = !content?.trim() || isSubmitting || remainingChars < 0;

  return (
    <div className={`bg-white ${className}`}>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        initialValues={{ content: "", tags: [] }}
        preserve={false}
      >
        <div className="px-4 py-4">
          <div className="flex gap-2">
            {/* 用户头像 */}
            <Avatar
              src={session?.user?.image || "/images/defaultAvatar.jpg"}
              size={32}
              className="flex-shrink-0"
            />
            
            {/* 主要内容区域 */}
            <div className="flex-1 min-w-0">
              {/* 文本输入区域 - 使用 Mentions 支持 #标签提示 */}
              <Form.Item name="content" className="!mb-2">
                <Mentions
                  placeholder={placeholder}
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  prefix="#"
                  options={tagOptions}
                  variant="borderless"
                  className="w-full text-base border-none outline-none bg-transparent p-0"
                  onChange={(value) => {
                    // 限制字符数
                    if (value && value.length > MAX_CHARS) {
                      const truncatedValue = value.substring(0, MAX_CHARS);
                      form.setFieldValue('content', truncatedValue);
                      messageApi.warning(`内容不能超过${MAX_CHARS}个字符`);
                      return;
                    }
                    // 正常更新表单值
                    form.setFieldValue('content', value);
                  }}
                  filterOption={(input, option) => {
                    const label = (option as any)?.label;
                    return label ? label.toLowerCase().includes(input.toLowerCase()) : false;
                  }}
                />
              </Form.Item>

              {/* 图片预览 */}
              {images.length > 0 && (
                <div className={`mb-2 flex flex-wrap gap-2 ${
                  images.length === 1 ? 'max-w-xs' : 'w-full'
                }`}>
                  {images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className={`relative group ${
                        images.length === 1
                          ? 'w-32 h-32'
                          : images.length === 2
                          ? 'w-24 h-24'
                          : 'w-20 h-20'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={image}
                          alt={`上传的图片 ${index + 1}`}
                          fill
                          className="object-cover rounded-lg border border-neutral-200"
                          unoptimized
                          onError={() => {
                            console.error('Image load error:', image);
                            // 可以在这里设置一个默认图片或者移除这个图片
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', image);
                          }}
                        />
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-4 h-4 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <CloseOutlined className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 工具栏 */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  {/* 图片上传 */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={images.length >= MAX_IMAGES}
                    className="p-1 text-primary-600 hover:bg-primary-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PictureOutlined className="w-4 h-4" />
                  </button>
                  
                  {/* 字符计数 */}
                  <div className={`text-xs ${
                    remainingChars < 20 ? 'text-warning' : 
                    remainingChars < 0 ? 'text-error' : 'text-neutral-500'
                  }`}>
                    {remainingChars}
                  </div>
                </div>

                {/* 发布按钮 - 使用图标 */}
                <button
                  onClick={handleSubmit}
                  disabled={isPostDisabled}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    isPostDisabled 
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
                  }`}
                  title="发布"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <SendOutlined className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}

