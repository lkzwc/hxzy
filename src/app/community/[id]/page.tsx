'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Eyes, Like } from '@icon-park/react'
import CommentSection from '@/components/CommentSection'

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
  _count: {
    commentLikes: number
  }
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 帖子内容 */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-12 h-12">
              <Image
                src={post.author.image || '/images/default-avatar.png'}
                alt={post.author.name || '用户'}
                fill
                className="rounded-full object-cover border-2 border-white shadow-sm"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-medium text-gray-900">{post.author.name || '匿名用户'}</div>
                <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                <div className="text-sm text-gray-500">
                  {dayjs(post.createdAt).format('YYYY年MM月DD日 HH:mm')}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eyes theme="outline" size="14" />
                  {post.views} 次浏览
                </span>
                <span className="flex items-center gap-1">
                  <Like theme="outline" size="14" />
                  {post.likes} 次点赞
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">{post.title}</h1>
          <article className="prose prose-gray max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
          </article>

          {post.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {post.images.map((url, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-sm group">
                  <Image
                    src={url}
                    alt={`图片 ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 pt-2 border-t border-gray-100">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-sm bg-[#F3E5D7] text-[#B87A56] rounded-full 
                    hover:bg-[#B87A56] hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 评论区 */}
        <div className="border-t border-gray-100 bg-gray-50/50">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
              <span>评论</span>
              <span className="text-sm font-normal text-gray-500">({post.comments.length})</span>
            </h2>

            {/* 使用 CommentSection 组件 */}
            <CommentSection 
              postId={post.id} 
              comments={post.comments}
              onCommentAdded={(newComment) => {
                setPost(prev => prev ? {
                  ...prev,
                  comments: [...prev.comments, newComment]
                } : null)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 