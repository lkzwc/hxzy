'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Heart, Star, BookOpen, MessageSquare, ChevronRight } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import Link from 'next/link'
import LikeButton from '@/components/LikeButton'
import { motion, AnimatePresence } from 'framer-motion'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  _count: {
    comments: number
    postLikes: number
  }
}

interface Stats {
  posts: number
  comments: number
  likes: number
}

// 定义功能区块
const features = [
  { 
    id: 'likes', 
    name: '我的点赞', 
    icon: <Heart className="w-5 h-5" />,
    description: '点赞过的帖子',
    color: 'text-rose-500',
    available: true
  },
  { 
    id: 'favorites', 
    name: '我的收藏', 
    icon: <Star className="w-5 h-5" />,
    description: '收藏的内容',
    color: 'text-amber-500',
    available: false
  },
  { 
    id: 'study', 
    name: '学习记录', 
    icon: <BookOpen className="w-5 h-5" />,
    description: '学习的历程',
    color: 'text-emerald-500',
    available: false
  },
]

export default function ProfilePage() {
  const { data: session } = useSession()
  const [activeFeature, setActiveFeature] = useState('likes')
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    comments: 0,
    likes: 0,
  })
  const [likedPosts, setLikedPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 获取用户统计数据
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}/stats`)
        .then(res => res.json())
        .then(data => {
          setStats(data)
        })
        .catch(error => {
          console.error('获取用户统计数据失败:', error)
        })
    }
  }, [session?.user?.id])

  // 获取用户点赞的帖子列表
  useEffect(() => {
    if (session?.user?.id && activeFeature === 'likes') {
      setIsLoading(true)
      fetch(`/api/users/${session.user.id}/liked-posts`)
        .then(res => res.json())
        .then(data => {
          setLikedPosts(data.posts || [])
        })
        .catch(error => {
          console.error('获取用户点赞帖子列表失败:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [session?.user?.id, activeFeature])

  // 渲染帖子列表
  const renderPosts = (posts: Post[]) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="divide-y divide-neutral-100"
    >
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4 opacity-80"
          >
            💝
          </motion.div>
          <div className="text-neutral-400 text-lg">还没有点赞任何帖子</div>
          <Link 
            href="/community" 
            className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors"
          >
            去社区看看
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        posts.map((post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={`/community/${post.id}`}
              className="block px-8 py-6 hover:bg-neutral-50/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-neutral-900 mb-2 line-clamp-1">{post.title}</h3>
                  <p className="text-neutral-500 text-sm line-clamp-2 mb-3 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span>{dayjs(post.createdAt).format('YYYY年MM月DD日')}</span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {post._count.comments} 条评论
                    </span>
                    <LikeButton 
                      postId={post.id} 
                      initialLikes={post._count.postLikes} 
                      className="!gap-1.5 !text-xs"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))
      )}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 顶部背景 */}
      <div className="h-60 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 -mt-32">
        {/* 用户信息卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-neutral-100/50 backdrop-blur-sm 
            bg-white/60 p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-32 h-32">
              <Image
                src={session?.user?.image || '/images/default-avatar.png'}
                alt={session?.user?.name || '用户'}
                fill
                sizes="(max-width: 128px) 100vw, 128px"
                className="rounded-2xl object-cover shadow-sm"
                priority
              />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                {session?.user?.name || '未登录用户'}
              </h1>
              <p className="text-neutral-500 mb-6">
                {session?.user?.email || '请先登录'}
              </p>
              <div className="inline-flex items-center gap-8 px-6 py-3 bg-neutral-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">{stats.posts}</div>
                  <div className="text-sm text-neutral-500 mt-0.5">发帖</div>
                </div>
                <div className="w-px h-12 bg-neutral-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">{stats.comments}</div>
                  <div className="text-sm text-neutral-500 mt-0.5">评论</div>
                </div>
                <div className="w-px h-12 bg-neutral-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">{stats.likes}</div>
                  <div className="text-sm text-neutral-500 mt-0.5">获赞</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 功能标签页 */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100/50 overflow-hidden">
          <div className="flex overflow-x-auto hide-scrollbar border-b border-neutral-100">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => feature.available && setActiveFeature(feature.id)}
                disabled={!feature.available}
                className={`relative flex-shrink-0 flex items-center gap-2 px-8 py-5 text-sm font-medium 
                  ${activeFeature === feature.id 
                    ? `${feature.color} bg-neutral-50/50` 
                    : feature.available 
                      ? 'text-neutral-500 hover:text-neutral-700' 
                      : 'text-neutral-300 cursor-not-allowed'
                  } transition-all`}
              >
                {feature.icon}
                <div className="text-left whitespace-nowrap">
                  <div>{feature.name}</div>
                  <div className="text-xs opacity-60 mt-0.5">{feature.description}</div>
                </div>
                {activeFeature === feature.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${feature.color.replace('text-', 'bg-')}`}
                  />
                )}
                {!feature.available && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 内容区域 */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-20"
                >
                  <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-primary/20 border-t-primary"></div>
                </motion.div>
              ) : (
                activeFeature === 'likes' && renderPosts(likedPosts)
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}