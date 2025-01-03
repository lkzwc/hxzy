'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { Like, Eyes, Comment } from '@icon-park/react'

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
  createdAt: string
  author: Author
}

interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  views: number
  likes: number
  tags: string[]
  author: Author
  comments: Comment[]
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      if (!response.ok) {
        throw new Error('帖子加载失败')
      }
      const data = await response.json()
      setPost(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          authorId: session.user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('评论发送失败')
      }

      const newComment = await response.json()
      setPost(prev => prev ? {
        ...prev,
        comments: [newComment, ...prev.comments]
      } : null)
      setComment('')
    } catch (err) {
      console.error('Error posting comment:', err)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B87A56]"></div>
    </div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">
      {error}
    </div>
  }

  if (!post) {
    return <div className="flex justify-center items-center min-h-screen">
      帖子不存在
    </div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-[#B87A56] mb-4">{post.title}</h1>
        
        <div className="flex items-center mb-4">
          <img
            src={post.author.image || '/images/default-avatar.png'}
            alt={post.author.name || '用户'}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-medium">{post.author.name || '匿名用户'}</div>
            <div className="text-sm text-gray-500">
              {dayjs(post.createdAt).fromNow()}
            </div>
          </div>
        </div>

        <div className="prose max-w-none mb-6">
          {post.content}
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          <div className="flex items-center mr-4">
            <Eyes theme="outline" size="16" className="mr-1" />
            {post.views}
          </div>
          <div className="flex items-center mr-4">
            <Like theme="outline" size="16" className="mr-1" />
            {post.likes}
          </div>
          <div className="flex items-center">
            <Comment theme="outline" size="16" className="mr-1" />
            {post.comments.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">发表评论</h2>
        <form onSubmit={handleSubmitComment}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={session ? "写下你的评论..." : "请先登录后发表评论"}
            disabled={!session}
            className="w-full p-3 border border-gray-200 rounded-lg mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#B87A56]"
          />
          <button
            type="submit"
            disabled={!session || !comment.trim()}
            className="px-6 py-2 bg-[#B87A56] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发表评论
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">全部评论 ({post.comments.length})</h2>
        {post.comments.length > 0 ? (
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <div className="flex items-center mb-3">
                  <img
                    src={comment.author.image || '/images/default-avatar.png'}
                    alt={comment.author.name || '用户'}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium">{comment.author.name || '匿名用户'}</div>
                    <div className="text-sm text-gray-500">
                      {dayjs(comment.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
                <div className="text-gray-700 pl-11">
                  {comment.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            暂无评论，来说两句吧
          </div>
        )}
      </div>
    </div>
  )
} 