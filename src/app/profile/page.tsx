'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eyes, Message, Time, Edit, Comment, Like } from '@icon-park/react'
import useSWR from 'swr'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import LikeButton from '@/components/LikeButton'
import Link from 'next/link'

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

// 定义标签页
const tabs = [
  { id: 'posts', name: '发帖', icon: <Edit theme="outline" size="18" /> },
  { id: 'comments', name: '评论', icon: <Comment theme="outline" size="18" /> },
]

export default function ProfilePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('posts')
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    comments: 0,
    likes: 0,
  })
  const [userPosts, setUserPosts] = useState<Post[]>([])

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

  // 获取用户帖子列表
  useEffect(() => {
    if (session?.user?.id && activeTab === 'posts') {
      fetch(`/api/users/${session.user.id}/posts`)
        .then(res => res.json())
        .then(data => {
          setUserPosts(data.posts || [])
        })
        .catch(error => {
          console.error('获取用户帖子列表失败:', error)
        })
    }
  }, [session?.user?.id, activeTab])

  // 渲染内容
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <Image
                  src={session?.user?.image || '/images/default-avatar.png'}
                  alt={session?.user?.name || '用户'}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {session?.user?.name || '未登录用户'}
                </h1>
                <p className="text-gray-500">
                  {session?.user?.email || '请先登录'}
                </p>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.posts}</div>
                <div className="text-gray-500">发帖</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.comments}</div>
                <div className="text-gray-500">评论</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.likes}</div>
                <div className="text-gray-500">获赞</div>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="tabs mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab tab-lg gap-2 ${
                activeTab === tab.id ? 'tab-active' : ''
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* 帖子列表 */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body text-center py-10 opacity-70">
                  暂无发帖内容
                </div>
              </div>
            ) : (
              userPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="card-body">
                    <h2 className="card-title">{post.title}</h2>
                    <p className="text-gray-600 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                      <span>{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                      <span className="flex items-center gap-1">
                        <Comment theme="outline" size="14" />
                        {post._count.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Like theme="outline" size="14" />
                        {post._count.postLikes}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* 评论列表 */}
        {activeTab === 'comments' && (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body text-center py-10 opacity-70">
              暂无评论内容
            </div>
          </div>
        )}
      </div>
    </div>
  )
}