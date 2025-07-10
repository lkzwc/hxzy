
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Avatar, message, Form, Mentions } from "antd";
import { POST_CONSTANTS } from "@/util/common";
import ImageUpload from "./ImageUpload";

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



  // 处理图片变化
  const handleImageChange = (urls: string[]) => {
    setImages(urls);
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

              {/* 图片预览区域 */}
              {images.length > 0 && (
                <div className="mb-3">
                  <ImageUpload
                    type="post"
                    value={images}
                    onChange={handleImageChange}
                    maxCount={MAX_IMAGES}
                    showPreviewOnly={true}
                  />
                </div>
              )}

              {/* 工具栏 */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  {/* 功能按钮 */}
                  <div className="flex items-center gap-1">
                    {/* 图片上传按钮 */}
                    <ImageUpload
                      type="post"
                      value={images}
                      onChange={handleImageChange}
                      maxCount={MAX_IMAGES}
                      showPreview={false}
                    />

                    {/* 其他功能按钮占位 */}
                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors" title="视频">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </button>

                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors" title="附件">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors" title="表情">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors" title="可见性">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* 字符计数 */}
                  <div className={`text-sm font-medium ${
                    remainingChars < 20 ? 'text-red-500' :
                    remainingChars < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {remainingChars}
                  </div>
                </div>

                {/* 发布按钮 */}
                <button
                  onClick={handleSubmit}
                  disabled={isPostDisabled}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isPostDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>发布中...</span>
                    </div>
                  ) : (
                    '发布'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>


    </div>
  );
}

