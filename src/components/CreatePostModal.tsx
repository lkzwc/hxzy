'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus } from '@icon-park/react'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
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

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('上传失败')
      }

      const data = await response.json()
      setImages(prev => [...prev, ...data.urls])
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('图片上传失败，请重试')
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
        },
        body: JSON.stringify({
          title,
          content,
          tags,
          images,
        }),
      })

      if (!response.ok) {
        throw new Error('发布失败')
      }

      setTitle('')
      setContent('')
      setTags([])
      setImages([])
      onClose()
      onSuccess?.()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('发布失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-3xl mx-4" onClick={handleModalClick}>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <h3 className="card-title text-lg font-medium mb-4">发布文章</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 标题输入 */}
              <div className="form-control">
                <input
                  type="text"
                  placeholder="标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* 内容输入 */}
              <div className="form-control">
                <textarea
                  placeholder="写下你的想法..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="textarea textarea-bordered min-h-[200px]"
                  required
                />
              </div>

              {/* 标签输入 */}
              <div className="form-control">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <div
                      key={tag}
                      className="badge badge-primary gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        className="btn btn-xs btn-circle btn-ghost"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="添加标签（回车确认）"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="input input-bordered w-full"
                />
              </div>

              {/* 图片上传 */}
              <div className="form-control">
                <div className="flex flex-wrap gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <Image
                        src={url}
                        alt={`上传的图片 ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                        className="btn btn-circle btn-xs absolute -top-2 -right-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Plus theme="outline" size="24" className="text-base-300" />
                  </label>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="card-actions justify-end mt-6 pt-4 border-t">
                <button
                  type="button"
                  className="btn"
                  onClick={onClose}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                >
                  {isSubmitting ? '发布中...' : '发布'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 