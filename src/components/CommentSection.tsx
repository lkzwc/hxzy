'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { Like, ImageFiles } from '@icon-park/react'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Author {
  id: number
  name: string | null
  image: string | null
}

interface Comment {
  id: number
  content: string
  images: string[]
  createdAt: string
  author: Author
  replies: Comment[]
  likedBy: { userId: number }[]
}

interface CommentSectionProps {
  postId: number
}

interface SessionUser {
  id: number
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 获取评论列表
  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (!response.ok) {
        throw new Error('获取评论失败')
      }
      const data = await response.json()
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  // 提交评论
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert('请先登录')
      return
    }
    if (!content.trim()) {
      alert('请输入评论内容')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          images,
          parentId: replyTo?.id,
        }),
      })

      if (!response.ok) {
        throw new Error('发表评论失败')
      }

      // 重置表单
      setContent('')
      setImages([])
      setReplyTo(null)
      // 刷新评论列表
      fetchComments()
    } catch (err) {
      alert(err instanceof Error ? err.message : '发表评论失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('上传图片失败')
      }

      const data = await response.json()
      setImages(prev => [...prev, ...data.urls])
    } catch (err) {
      alert(err instanceof Error ? err.message : '上传图片失败')
    }
  }

  // 点赞评论
  const handleLike = async (commentId: number) => {
    if (!session) {
      alert('请先登录')
      return
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('点赞失败')
      }

      // 更新评论列表
      fetchComments()
    } catch (err) {
      alert(err instanceof Error ? err.message : '点赞失败')
    }
  }

  // 渲染评论
  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`${isReply ? 'ml-12 mt-4' : 'mt-6'} first:mt-0`}
    >
      <div className="flex gap-3">
        <Image
          src={comment.author.image || '/images/default-avatar.png'}
          alt={comment.author.name || '用户'}
          width={40}
          height={40}
          className="rounded-full shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">
                {comment.author.name || '匿名用户'}
              </span>
              <span className="text-sm text-gray-500">
                {dayjs(comment.createdAt).fromNow()}
              </span>
            </div>
            <p className="text-gray-700 mb-2">{comment.content}</p>
            {comment.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {comment.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`评论图片 ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <button
              className={`flex items-center gap-1 transition-colors
                ${comment.likedBy.some(like => like.userId === (session?.user as SessionUser)?.id)
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary'
                }`}
              onClick={() => handleLike(comment.id)}
            >
              <Like theme="outline" size="16" />
              {comment.likedBy.length}
            </button>
            <button
              className="text-gray-500 hover:text-primary transition-colors"
              onClick={() => setReplyTo(comment)}
            >
              回复
            </button>
          </div>
        </div>
      </div>

      {/* 渲染回复 */}
      {comment.replies?.map(reply => renderComment(reply, true))}
    </div>
  )

  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">加载评论中...</div>
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* 评论输入框 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <Image
            src={session?.user?.image || '/images/default-avatar.png'}
            alt={session?.user?.name || '用户'}
            width={40}
            height={40}
            className="rounded-full shrink-0"
          />
          <div className="flex-1 min-w-0">
            {replyTo && (
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                回复 {replyTo.author.name}：
                <button
                  type="button"
                  className="text-primary hover:opacity-80"
                  onClick={() => setReplyTo(null)}
                >
                  取消回复
                </button>
              </div>
            )}
            <textarea
              placeholder="写下你的评论..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="image-upload"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="image-upload"
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer"
            >
              <ImageFiles theme="outline" size="18" />
              添加图片
            </label>
            {images.length > 0 && (
              <span className="text-sm text-gray-500">
                已选择 {images.length} 张图片
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !session}
            className="btn btn-primary btn-sm"
          >
            {isSubmitting ? '发表中...' : '发表评论'}
          </button>
        </div>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`预览图片 ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            暂无评论，来发表第一条评论吧
          </div>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  )
} 