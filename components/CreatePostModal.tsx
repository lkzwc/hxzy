"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CloudUploadOutlined,
  PlusOutlined,
  CloseOutlined,
  TagOutlined,
  SendOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  message,
  Input,
  Modal,
  Form,
  Button,
  Upload,
  Tag,
  Avatar,
  Tooltip,
  Space,
  Divider,
  Select,
  Empty,
} from "antd";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categories?: Array<{ name: string; id: number; order: number }>;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onSuccess,
  categories = [],
}: CreatePostModalProps) {
  const [form] = Form.useForm();
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  // 将分类数据转换为 Select 选项
  const tagOptions = categories
    .filter((category) => category.name !== "全部") // 排除"全部"选项
    .map((category) => ({
      value: category.name,
      label: category.name,
    }));

  // 重置表单和状态
  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      setSelectedTags([]);
      setImages([]);
    }
  }, [isOpen, form]);

  // 处理标签变更
  const handleTagChange = (value:any,values: any) => {
    console.log("dsad",value,values);
    // 标签数量限制
    if (values.length > 3) {
      messageApi.warning("最多只能添加3个标签");
      return;
    }

    // 处理标签长度限制
    const validTags = values.map((tag: any) => {
      const trimmedTag = tag.trim();
      if (trimmedTag.length > 20) {
        messageApi.warning("标签长度不能超过20个字符");
        return trimmedTag.substring(0, 20);
      }
      return trimmedTag;
    });

    // 过滤掉空标签
    const filteredTags = validTags.filter((tag: any) => tag.length > 0);

    // 去重
    const uniqueTags = [...new Set(filteredTags)];

    setSelectedTags(uniqueTags.slice(0, 3));
  };

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    if (!session?.user) {
      router.push("/login");
      return false;
    }

    // 检查图片数量限制
    if (images.length >= 9) {
      messageApi.warning("最多只能上传9张图片");
      return false;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "上传失败");
      }

      const data = await response.json();
      setImages((prev) => [...prev, ...data.urls]);
      return false; // 阻止默认上传行为
    } catch (error) {
      console.error("Error uploading images:", error);
      messageApi.warning("图片上传失败，请重试");
      return false;
    }
  };

  // 处理图片移除
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      // 先验证表单字段
      const values = await form.validateFields();
      const { title, content } = values;

      if (!session?.user) {
        router.push("/login");
        return;
      }

      // 验证标题是否为空
      if (!title || title.trim() === "") {
        messageApi.warning("请输入标题");
        return;
      }

      // 验证内容是否为空
      if (!content || content.trim() === "") {
        messageApi.warning("请输入内容");
        return;
      }

      // 验证标签
      if (selectedTags.length === 0) {
        messageApi.warning("请添加标签");
        return;
      }

      // 验证标题长度
      if (title.trim().length > 30) {
        messageApi.warning("标题不能超过30个字符");
        return;
      }

      // 验证内容长度
      if (content.trim().length > 250) {
        messageApi.warning("内容不能超过250个字符");
        return;
      }

      setIsSubmitting(true);
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          content,
          tags: selectedTags,
          images,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "发布失败");
      } else {
        messageApi.success("发布成功");
      }

      // 清理表单和状态
      form.resetFields();
      setSelectedTags([]);
      setImages([]);

      // 关闭模态框并刷新页面
      onClose();
      if (onSuccess) {
        onSuccess();
      }

      // 确保页面刷新
      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (error) {
      console.error("Error creating post:", error);
      messageApi.warning("发布失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重置表单
  const handleCancel = () => {
    form.resetFields();
    setSelectedTags([]);
    setImages([]);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
      destroyOnClose
      styles={{
        body: { padding: 0 },
        content: {
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
        },
        header: {
          borderBottom: "1px solid #f0f0f0",
          padding: "16px 24px",
        },
        mask: {
          backdropFilter: "blur(4px)",
          background: "rgba(0, 0, 0, 0.45)",
        },
      }}
      
    >
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        initialValues={{ title: "", content: "" }}
        preserve={false}
        name="createPostForm"
      >
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-4 w-full">
            <Avatar
              src={session?.user?.image || "/images/default-avatar.png"}
              size={70}
              style={{ objectFit: "cover", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            />
            <div className="flex-1 w-full">
              <Form.Item name="title" className="!mb-2">
                <Input
                  placeholder="输入标题..."
                  variant="borderless"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 500,
                    borderBottom: "1px solid #e5e7eb",
                    borderRadius: "0px",
                    width: "100%",
                    padding: "4px"
                  }}
                  className="hover:border-primary focus:border-primary"
                />
              </Form.Item>
              <Form.Item name="tags" className="!mb-0">
                <Select
                  mode="tags"
                  style={{ width: "100%",borderBottom:"1px solid #e5e7eb" }}
                  placeholder="可输入 可选择 最多三个标签"
                  onChange={handleTagChange}
                  value={selectedTags}
                  options={tagOptions}
                  variant="borderless"
                  maxTagCount={3}
                  tokenSeparators={[","]}
                  dropdownStyle={{ borderRadius: "8px" }}
                  className="tag-select-custom"
                  notFoundContent={null}
                  suffixIcon={<TagOutlined className="text-gray-400" />}
                  tagRender={(props) => {
                    const { label, value, closable, onClose } = props;
                    return (
                      <Tag
                        closable={closable}
                        onClose={onClose}
                        style={{
                          marginRight: 6,
                          padding: '4px 10px',
                          borderRadius: '16px',
                          backgroundColor: 'var(--primary-color)',
                          color: 'text-gray-400',
                          border: 'none',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {label}
                      </Tag>
                    );
                  }}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* 内容编辑区 */}
        <div className="px-4 py-3 bg-white">
          <Form.Item name="content" className="mb-0">
            <Input.TextArea
              placeholder="写下你的想法..."
              autoSize={{ minRows: 10, maxRows: 15 }}
              maxLength={500}
              showCount
              variant="borderless"
              style={{
                fontSize: "1rem",
                lineHeight: "1.6",
                color: "#333",
                width: "100%",
                padding: "8px 4px"
              }}
              className="custom-textarea w-full"
            />
          </Form.Item>
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between px-4 py-4 border-t bg-gray-50/90 shadow-inner w-full">
          <div className="flex items-center gap-3 w-[-webkit-fill-available]">
            <Upload
              accept="image/*"
              multiple
              showUploadList={false}
              beforeUpload={handleImageUpload}
              disabled={images.length >= 9}
            >
              <Button
                icon={<CloudUploadOutlined />}
                type="link"
                style={{
                  opacity: images.length >= 9 ? 0.5 : 1,
                  cursor: images.length >= 9 ? "not-allowed" : "pointer",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
              >
                添加图片 ({images.length}/9)
              </Button>
            </Upload>

            {/* 图片预览区 - 移到上传按钮后面 */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((url, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <Image
                      src={url}
                      alt={`上传的图片 ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover rounded-lg"
                    />
                    <div
                      className="absolute inset-0 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        transition: "all 0.2s ease",
                        opacity: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(0, 0, 0, 0.2)";
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(0, 0, 0, 0)";
                        e.currentTarget.style.opacity = "0";
                      }}
                    >
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        size="small"
                        style={{
                          color: "white",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                        onClick={() => handleRemoveImage(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            icon={<SendOutlined />}
            className="rounded-full px-5 py-1 h-auto flex items-center justify-center"
            style={{
              background: "var(--primary-color)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s ease",
            }}
          >
            <span className="ml-1">{isSubmitting ? "发布中..." : "发布"}</span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
