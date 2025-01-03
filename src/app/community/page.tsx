'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Search, Eyes, Like, Comment } from '@icon-park/react'
import CreatePostModal from '@/components/CreatePostModal'

// 配置 dayjs
dayjs.locale('zh-cn')

const categories = ['全部', '经方', '养生', '针灸', '中药', '诊断', '心得']

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

    if (tag) setActiveCategory(tag)
    if (search) setSearchQuery(search)
  }, [searchParams])

  useEffect(() => {
    fetchPosts()
  }, [activeCategory, searchQuery])

  const fetchPosts = async () => {
    try {
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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    if (category === '全部') {
      router.push('/community')
    } else {
      router.push(`/community?tag=${category}`)
    }
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
    <div className="container mx-auto max-w-7xl px-4 min-h-[500px]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 左侧筛选区 - 固定位置 */}
        <div className="w-[200px] shrink-0">
          <div className="fixed top-[72px] w-[200px]">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h3 className="text-base font-medium mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-0.5 h-4 bg-primary rounded-full"></span>
                分类筛选
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1.5 rounded-md transition-colors text-sm text-left
                      ${activeCategory === category 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 中间内容区 */}
        <div className="flex-1 min-w-0">
          {/* 固定的顶部搜索栏 */}
          <div className="fixed top-[72px] w-[calc(100%-460px)] max-w-[calc(100%-460px)] z-20">
            <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="搜索帖子..."
                  className="w-full pl-10 pr-4 py-2 border-0 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </form>
            </div>
          </div>

          {/* 帖子列表 */}
          <div className="pt-[72px] space-y-3">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                暂无帖子，来发布第一篇吧
              </div>
            ) : (
              posts.map(post => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all
                    border-l-[3px] border border-gray-100 border-l-primary/30"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={post.author.image || '/images/default-avatar.png'}
                      alt={post.author.name || '用户'}
                      className="w-8 h-8 rounded-full shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-semibold text-gray-900 truncate mr-4">
                          {post.title}
                        </h2>
                        <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
                          {post.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2 text-sm">{post.content}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span>{post.author.name || '匿名用户'}</span>
                          <span>{dayjs(post.createdAt).format('MM-DD HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eyes theme="outline" size="14" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Like theme="outline" size="14" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Comment theme="outline" size="14" />
                            {post._count.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 右侧边栏 - 固定位置 */}
        <div className="w-[260px] shrink-0">
          <div className="fixed top-[72px] w-[260px] space-y-4">
            {/* 发布文章按钮 */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition-colors text-sm"
            >
              发布文章
            </button>

            {/* 热门话题 */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h3 className="text-base font-medium mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-0.5 h-4 bg-primary rounded-full"></span>
                热门话题
              </h3>
              <div className="space-y-2.5">
                {['经方临床实践', '四气五味辨证', '针灸要穴'].map((topic, index) => (
                  <div key={index} className="flex items-center gap-2 group cursor-pointer">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-xs
                      ${index < 3 ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-500'}`}>
                      {index + 1}
                    </span>
                    <span className="text-gray-700 text-sm group-hover:text-primary transition-colors">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 活跃作者 */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h3 className="text-base font-medium mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-0.5 h-4 bg-primary rounded-full"></span>
                活跃作者
              </h3>
              <div className="space-y-3">
                {['张三丰', '李时珍', '孙思邈'].map((author, index) => (
                  <div key={index} className="flex items-center gap-2.5 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">
                      {author[0]}
                    </div>
                    <div>
                      <div className="text-sm text-gray-900 group-hover:text-primary transition-colors">{author}</div>
                      <div className="text-xs text-gray-500">发帖 {30 - index * 5}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPosts}
      />
    </div>
  )
} 