'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Search, Eyes, Like, Comment, Plus } from '@icon-park/react'
import CreatePostModal from '@/components/CreatePostModal'

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
  tags: string[]
  author: Author
  _count: {
    comments: number
    postLikes: number
  }
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    setActiveCategory(tag || '全部')
    if (search) setSearchQuery(search)
  }, [searchParams])

  useEffect(() => {
    fetchPosts()
  }, [activeCategory, searchQuery])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (activeCategory !== '全部') params.set('tag', activeCategory)

      const response = await fetch(`/api/posts?${params.toString()}`)
      if (!response.ok) {
        throw new Error('获取帖子列表失败')
      }
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/community?search=${searchQuery}`)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">
      {error}
    </div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4">
      {/* 固定的顶部搜索栏 */}
      <div className="sticky top-0 z-10 pb-2 bg-gray-50/80 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
          {/* 搜索和发帖按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <form onSubmit={handleSearch} className="relative flex items-center flex-1 w-full">
              <Search className="absolute left-4 text-gray-400" size="20" />
              <input
                type="text"
                placeholder="搜索感兴趣的内容..."
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all hover:bg-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <button
              onClick={() => session ? setIsModalOpen(true) : router.push('/api/auth/signin')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors sm:w-auto w-full"
            >
              <Plus theme="outline" size="18" />
              <span>发帖</span>
            </button>
          </div>

          {/* 分类导航 */}
         
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
        {posts.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-xl border border-gray-100">
            <div className="text-gray-400 mb-2 text-4xl sm:text-5xl">📝</div>
            <div className="text-gray-500 px-4">暂无帖子，来发布第一篇吧</div>
          </div>
        ) : (
          posts.map(post => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300
                border border-gray-100 hover:border-primary/30 group"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <img
                    src={post.author.image || '/images/default-avatar.png'}
                    alt={post.author.name || '用户'}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full shrink-0 border-2 border-white shadow-sm
                      group-hover:ring-2 group-hover:ring-primary/20 transition-all"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-2.5 gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                          {post.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium text-primary/90">{post.author.name || '匿名用户'}</span>
                          <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-xs text-gray-400">{dayjs(post.createdAt).format('MM月DD日 HH:mm')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-5 text-sm text-gray-400/90 shrink-0">
                        <span className="flex items-center gap-1.5 hover:text-primary/70 transition-colors">
                          <Eyes theme="outline" size="16" />
                          <span>{post.views}</span>
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-primary/70 transition-colors">
                          <Like theme="outline" size="16" />
                          <span>{post._count.postLikes}</span>
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-primary/70 transition-colors">
                          <Comment theme="outline" size="16" />
                          <span>{post._count.comments}</span>
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">{post.content}</p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs bg-primary/5 text-primary rounded-full border border-primary/10
                            group-hover:bg-primary/10 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPosts}
      />
    </div>
  )
} 