'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ImagePlus } from 'lucide-react'
import { motion } from 'framer-motion'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const tagInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      const newTag = currentTag.trim()
      // 标签长度限制
      if (newTag.length > 20) {
        alert('标签长度不能超过20个字符')
        return
      }
      // 标签数量限制
      if (selectedTags.length >= 5) {
        alert('最多只能添加5个标签')
        return
      }
      // 避免重复标签
      if (selectedTags.includes(newTag)) {
        alert('该标签已存在')
        return
      }
      setSelectedTags(prev => [...prev, newTag])
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      router.push('/login')
      return
    }

    if (selectedTags.length === 0) {
      alert('请至少选择一个标签')
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
          tags: selectedTags,
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
      setSelectedTags([])
      setImages([])
      onClose()
      onSuccess?.()
      router.refresh()
    } catch (error) {
      console.error('Error creating post:', error)
      alert(error instanceof Error ? error.message : '发布失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-3xl mx-4" onClick={e => e.stopPropagation()}>
        <div className="bg-white rounded-xl shadow-xl">
          <div className="p-0">
            {/* 顶部标题栏 */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <img
                  src={session?.user?.image || '/images/default-avatar.png'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <input
                  type="text"
                  placeholder="输入标题..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium bg-transparent border-none focus:outline-none placeholder:text-gray-400 w-full"
                />
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-xl text-gray-500">×</span>
              </button>
            </div>

            {/* 标签输入区 */}
            <div className="relative px-4 py-2 border-b bg-gray-50/80">
              <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      className="w-4 h-4 flex items-center justify-center hover:bg-primary/20 rounded-full transition-colors"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  ref={tagInputRef}
                  type="text"
                  placeholder={selectedTags.length === 0 ? "添加标签以便他人快速找到，输入标签回车（最多5个）" : "继续添加标签..."}
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-1 bg-transparent border-none text-sm focus:outline-none min-w-[120px]"
                  disabled={selectedTags.length >= 5}
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
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50/80">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <ImagePlus className="w-4 h-4" />
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
                        sizes="48px"
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-xs transition-colors"
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
                  className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title.trim() || !content.trim() || selectedTags.length === 0}
                  className="px-6 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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