'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Pic } from '@icon-park/react'

interface CreatePostDialogProps {
  open: boolean
  onClose: () => void
  onPostCreated?: () => void
}

export default function CreatePostDialog({
  open,
  onClose,
  onPostCreated,
}: CreatePostDialogProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTag, setCurrentTag] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    if (!session?.user) {
      router.push('/login')
      return
    }

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

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
    } catch (error) {
      console.error('Error uploading images:', error)
      alert(error instanceof Error ? error.message : '图片上传失败，请重试')
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      if (!tags.includes(currentTag.trim())) {
        setTags(prev => [...prev, currentTag.trim()])
      }
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      router.push('/login')
      return
    }

    try {
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
          tags,
          images,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '发布失败')
      }

      const data = await response.json()
      setTitle('')
      setContent('')
      setTags([])
      setImages([])
      onClose()
      onPostCreated?.()
      router.refresh()
    } catch (error) {
      console.error('Error creating post:', error)
      alert(error instanceof Error ? error.message : '发布失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!open) return null

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-3xl mx-4" onClick={handleModalClick}>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {/* 顶部标题栏 */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Image
                    src={session?.user?.image || '/images/default-avatar.png'}
                    alt="avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  placeholder="输入标题..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium bg-transparent border-none focus:outline-none placeholder:text-gray-400 w-full"
                />
              </div>
              <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">×</button>
            </div>

            {/* 标签选择区 */}
            <div className="px-4 py-2 border-b bg-base-200/50">
              <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
                {tags.length === 0 && (
                  <span className="text-sm text-gray-400">添加标签，让更多人找到你的文章</span>
                )}
                {tags.map(tag => (
                  <div
                    key={tag}
                    className="badge badge-primary gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost btn-circle"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="输入标签按回车添加"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-1 bg-transparent border-none text-sm focus:outline-none min-w-[120px]"
                />
              </div>
            </div>

            {/* 内容编辑区 */}
            <div className="p-4 min-h-[300px]">
              <textarea
                placeholder="写下你的想法..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full min-h-[280px] bg-transparent border-none resize-none focus:outline-none text-base leading-relaxed"
              />
            </div>

            {/* 底部操作栏 */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-base-200/50">
              <div className="flex items-center gap-2">
                <label className="btn btn-ghost btn-sm">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Pic theme="outline" size="18" className="mr-1" />
                  添加图片
                </label>
                {/* 显示已上传的图片预览 */}
                <div className="flex gap-2">
                  {images.map((url, index) => (
                    <div key={index} className="relative w-12 h-12">
                      <Image
                        src={url}
                        alt={`上传的图片 ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-1 -right-1 btn btn-xs btn-circle btn-error"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={onClose}
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary btn-sm px-6"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                >
                  {isSubmitting ? '发布中...' : '发布'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 