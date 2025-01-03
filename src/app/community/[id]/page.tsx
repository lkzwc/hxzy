'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 配置 dayjs
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
}

interface Post {
  id: number
  title: string
  content: string
  images: string[]
  createdAt: string
  views: number
  likes: number
  tags: string[]
  author: Author
  comments: Comment[]
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [commentImages, setCommentImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      if (!response.ok) {
        throw new Error('获取帖子详情失败')
      }
      const data = await response.json()
      setPost(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setIsLoading(false)
    }
  }

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
      setCommentImages(prev => [...prev, ...data.urls])
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('图片上传失败，请重试')
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      router.push('/login')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/posts/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          images: commentImages,
        }),
      })

      if (!response.ok) {
        throw new Error('评论失败')
      }

      const newComment = await response.json()
      setPost(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment]
      } : null)
      setComment('')
      setCommentImages([])
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('评论失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B87A56]"></div>
    </div>
  }

  if (error || !post) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">
      {error || '帖子不存在'}
    </div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* 帖子内容 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={post.author.image || '/images/default-avatar.png'}
              alt={post.author.name || '用户'}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium">{post.author.name || '匿名用户'}</div>
              <div className="text-sm text-gray-500">
                {dayjs(post.createdAt).format('YYYY年MM月DD日 HH:mm')}
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-700 mb-6 whitespace-pre-wrap">{post.content}</p>

          {post.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {post.images.map((url, index) => (
                <div key={index} className="relative aspect-video">
                  <Image
                    src={url}
                    alt={`图片 ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 text-sm bg-[#F3E5D7] text-[#B87A56] rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 评论区 */}
        <div>
          <h2 className="text-lg font-semibold mb-6 pb-2 border-b">
            评论 ({post.comments.length})
          </h2>

          {/* 评论列表 */}
          <div className="space-y-6 mb-8">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex gap-4">
                <img
                  src={comment.author.image || '/images/default-avatar.png'}
                  alt={comment.author.name || '用户'}
                  className="w-8 h-8 rounded-full shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.author.name || '匿名用户'}</span>
                    <span className="text-xs text-gray-500">
                      {dayjs(comment.createdAt).format('MM-DD HH:mm')}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  {comment.images.length > 0 && (
                    <div className="flex gap-2">
                      {comment.images.map((url, index) => (
                        <div key={index} className="relative w-20 h-20">
                          <Image
                            src={url}
                            alt={`评论图片 ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 评论表单 */}
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              placeholder="写下你的评论..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B87A56] min-h-[100px]"
              required
            />

            {/* 图片上传区域 */}
            <div>
              <div className="flex flex-wrap gap-4 mb-4">
                {commentImages.map((url, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <Image
                      src={url}
                      alt={`上传的图片 ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setCommentImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#B87A56] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-3xl text-gray-400">+</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="px-6 py-2 bg-[#B87A56] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '发送中...' : '发送'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 