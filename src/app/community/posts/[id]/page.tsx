'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { Like, Share } from '@icon-park/react'
import CommentSection from '@/components/CommentSection'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Author {
  id: number
  name: string | null
  image: string | null
}

interface Post {
  id: number
  title: string
  content: string
  images: string[]
  createdAt: string
  author: Author
  tags: string[]
  likedBy: { userId: number }[]
}

interface SessionUser {
  id: number
  name?: string | null
  email?: string | null
  image?: string | null
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取帖子详情
  const fetchPost = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/posts/${params.id}`)
      if (!response.ok) {
        throw new Error('获取帖子失败')
      }
      const data = await response.json()
      setPost(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [params.id])

  // 点赞帖子
  const handleLike = async () => {
    if (!session) {
      alert('请先登录')
      return
    }
    if (!post) return

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('点赞失败')
      }

      // 更新帖子数据
      fetchPost()
    } catch (err) {
      alert(err instanceof Error ? err.message : '点赞失败')
    }
  }

  // 分享帖子
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content,
        url: window.location.href,
      }).catch(() => {
        // 如果用户取消分享，不显示错误
      })
    } else {
      // 如果不支持原生分享，复制链接
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('链接已复制到剪贴板'))
        .catch(() => alert('复制链接失败'))
    }
  }

  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">加载中...</div>
  }

  if (error || !post) {
    return <div className="py-8 text-center text-red-500">{error || '帖子不存在'}</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 帖子内容 */}
      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          {/* 作者信息 */}
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={post.author.image || '/images/default-avatar.png'}
              alt={post.author.name || '用户'}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <div className="font-medium text-gray-900">
                {post.author.name || '匿名用户'}
              </div>
              <div className="text-sm text-gray-500">
                {dayjs(post.createdAt).fromNow()}
              </div>
            </div>
          </div>

          {/* 标题和标签 */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/community?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 text-sm text-primary bg-primary/5 rounded-full hover:bg-primary/10 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* 正文内容 */}
          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* 图片 */}
          {post.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {post.images.map((image, index) => (
                <div key={index} className="relative pt-[100%]">
                  <Image
                    src={image}
                    alt={`帖子图片 ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center gap-6 text-sm">
            <button
              className={`flex items-center gap-1 transition-colors
                ${post.likedBy.some(like => like.userId === (session?.user as SessionUser)?.id)
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary'
                }`}
              onClick={handleLike}
            >
              <Like theme="outline" size="20" />
              {post.likedBy.length > 0 && post.likedBy.length}
            </button>
            <button
              className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
              onClick={handleShare}
            >
              <Share theme="outline" size="20" />
              分享
            </button>
          </div>
        </div>
      </article>

      {/* 评论区 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">评论</h2>
        <CommentSection postId={post.id} />
      </div>
    </div>
  )
} 