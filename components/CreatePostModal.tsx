'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CloudUploadOutlined, PlusOutlined, CloseOutlined, TagOutlined, SendOutlined, PictureOutlined } from '@ant-design/icons'
import { App, Input, Modal, Form, Button, Upload, Tag, Avatar, Tooltip, Space, Divider } from 'antd'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [form] = Form.useForm();
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showImageUploader, setShowImageUploader] = useState(false)
  const tagInputRef = useRef<any>(null)
  const { data: session } = useSession()
  const router = useRouter()
  const { message } = App.useApp();
  
  // 重置表单和状态
  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      setSelectedTags([]);
      setImages([]);
      setCurrentTag('');
    }
  }, [isOpen, form]);

  // 处理标签添加
  const handleAddTag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      const newTag = currentTag.trim()
      // 标签长度限制
      if (newTag.length > 20) {
        message.warning('标签长度不能超过20个字符');
        return
      }
      // 标签数量限制
      if (selectedTags.length >= 3) {
        message.warning('最多只能添加3个标签');
        return
      }
      // 避免重复标签
      if (selectedTags.includes(newTag)) {
        message.warning('该标签已存在');
        return
      }
      setSelectedTags(prev => [...prev, newTag])
      setCurrentTag('')
      // 确保添加标签后重新聚焦输入框
      setTimeout(() => {
        if (tagInputRef.current) {
          tagInputRef.current.focus()
        }
      }, 0)
    }
  }, [currentTag, selectedTags, message])

  // 处理标签移除
  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    if (!session?.user) {
      router.push('/login')
      return false
    }

    // 检查图片数量限制
    if (images.length >= 9) {
      message.warning('最多只能上传9张图片');
      return false
    }

    const formData = new FormData()
    formData.append('files', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '上传失败')
      }

      const data = await response.json()
      setImages(prev => [...prev, ...data.urls])
      return false // 阻止默认上传行为
    } catch (error) {
      console.error('Error uploading images:', error)
      message.warning('图片上传失败，请重试');
      return false
    }
  }

  // 处理图片移除
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { title, content } = values;
      
      if (!session?.user) {
        router.push('/login')
        return
      }

      if (selectedTags.length === 0) {
        message.warning('请添加标签');
        return
      }

      // 验证标题长度
      if (title.trim().length > 30) {
        message.warning('标题不能超过30个字符');
        return
      }

      // 验证内容长度
      if (content.trim().length > 250) {
        message.warning('内容不能超过250个字符');
        return
      }

      setIsSubmitting(true)
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content,
          tags: selectedTags,
          images,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '发布失败')
      } else {
        message.success('发布成功');
      }
      
      // 清理表单和状态
      form.resetFields()
      setSelectedTags([])
      setImages([])
      setCurrentTag('')
      
      // 关闭模态框并刷新页面
      onClose()
      if (onSuccess) {
        onSuccess()
      }
      
      // 确保页面刷新
      setTimeout(() => {
        router.refresh()
      }, 100)
    } catch (error) {
      console.error('Error creating post:', error)
      message.warning('发布失败，请重试');
    } finally {
      setIsSubmitting(false)
    }
  }

  // 重置表单
  const handleCancel = () => {
    form.resetFields()
    setSelectedTags([])
    setImages([])
    onClose()
  }

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
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' 
        }
      }}
    >
      <Form 
        form={form} 
        layout="vertical" 
        initialValues={{ title: '', content: '' }}
        preserve={false}
        name="createPostForm"
      >

        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3 w-[-webkit-fill-available]">
            <Avatar 
              src={session?.user?.image || '/images/default-avatar.png'} 
              size={32} 
              style={{ objectFit: 'cover' }} 
            />
            <Form.Item name="title" noStyle>
              <Input 
                placeholder="输入标题..."
                bordered={false}
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  borderBottom: '1px solid #e5e7eb',
                  padding: '0.375rem 0.5rem',
                  width: '100%',
                }}
              />
            </Form.Item>
          </div>
        </div>

        {/* 标签输入区 */}
        <div className="px-4 py-2 bg-gray-50 rounded-xl">
          <Space className="flex flex-wrap gap-2 items-center min-h-[32px]" size={[8, 8]}>
            <TagOutlined className="text-primary" />
            {selectedTags.map(tag => (
              <Tag
                key={tag}
                style={{ 
                  padding: '4px 8px', 
                  backgroundColor: 'rgba(var(--primary-rgb), 0.1)', 
                  color: 'var(--primary-color)',
                  borderRadius: '8px',
                  marginRight: 0,
                  border: 'none',
                  transition: 'all 0.2s ease'
                }}
                closeIcon={<CloseOutlined className="text-xs" />}
                onClose={() => handleRemoveTag(tag)}
              >
                {tag}
              </Tag>
            ))}
            <Input
              ref={tagInputRef}
              placeholder={selectedTags.length === 0 ? "添加标签以便他人快速找到，输入标签回车（最多3个）" : "继续添加标签..."}
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleAddTag}
              bordered={false}
              style={{
                flex: 1,
                minWidth: '100px',
                backgroundColor: 'transparent',
              }}
              disabled={selectedTags.length >= 3}
            />
          </Space>
        </div>

        {/* 内容编辑区 */}
        <div className="p-4">
          <Form.Item name="content" noStyle>
            <Input.TextArea
              placeholder="写下你的想法..."
              autoSize={{ minRows: 10, maxRows: 15 }}
              maxLength={500}
              showCount
              variant="borderless"
              style={{
                fontSize: '1rem',
                lineHeight: '1.5',
              }}
            />
          </Form.Item>
        </div>



        {/* 底部操作栏 */}
        <div className="flex items-center justify-between mt-2 px-4 py-3 border-t bg-gray-50/80">
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
                type='link'
                style={{
                  opacity: images.length >= 9 ? 0.5 : 1,
                  cursor: images.length >= 9 ? 'not-allowed' : 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
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
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        transition: 'all 0.2s ease',
                        opacity: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                        e.currentTarget.style.opacity = '0';
                      }}
                    >
                      <Button 
                        type="text" 
                        icon={<CloseOutlined />} 
                        size="small" 
                        style={{
                          color: 'white',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
            style={{
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              color: 'white',
              fontWeight: 'bold'
            }}
            disabled={form.getFieldValue('title')?.trim() === '' || 
                     form.getFieldValue('content')?.trim() === ''}
          >
            {isSubmitting ? '发布中...' : '发布'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}