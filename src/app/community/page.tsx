'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Eyes, Like, Comment } from '@icon-park/react'

// 配置 dayjs
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
  createdAt: string
  views: number
  likes: number
  tags: string[]
  author: Author
  _count: {
    comments: number
  }
}

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [pagination.page])

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `/api/posts?page=${pagination.page}&pageSize=${pagination.pageSize}`
      )
      if (!response.ok) {
        throw new Error('获取帖子列表失败')
      }
      const data = await response.json()
      setPosts(data.posts)
      setPagination(prev => ({ ...prev, ...data.pagination }))
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B87A56]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#B87A56]">社区讨论</h1>
        <button
          onClick={() => router.push('/community/new')}
          className="px-4 py-2 bg-[#B87A56] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          发布帖子
        </button>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/community/${post.id}`)}
          >
            <div className="flex items-center mb-4">
              <img
                src={post.author.image || '/images/default-avatar.png'}
                alt={post.author.name || '用户'}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-medium">{post.author.name || '匿名用户'}</div>
                <div className="text-sm text-gray-500">
                  {dayjs(post.createdAt).format('YYYY年MM月DD日 HH:mm')}
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              {post.title}
            </h2>

            <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>

            <div className="flex items-center justify-between">
              <div className="flex space-x-4 text-gray-500 text-sm">
                <div className="flex items-center">
                  <Eyes theme="outline" size="16" className="mr-1" />
                  {post.views}
                </div>
                <div className="flex items-center">
                  <Like theme="outline" size="16" className="mr-1" />
                  {post.likes}
                </div>
                <div className="flex items-center">
                  <Comment theme="outline" size="16" className="mr-1" />
                  {post._count.comments}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-[#F3E5D7] text-[#B87A56] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length > 0 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            上一页
          </button>
          <span className="text-gray-600">
            第 {pagination.page} 页，共 {pagination.totalPages} 页
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          暂无帖子，来发布第一篇吧
        </div>
      )}
    </div>
  )
} 