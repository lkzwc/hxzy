'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { HeartOutlined, StarOutlined, BookOutlined, MessageOutlined, RightOutlined, BellOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import Link from 'next/link'
import LikeButton from '@/components/LikeButton'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsProps, Badge } from 'antd'
import useSWR, { mutate } from 'swr'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// Fetcher 函数
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// 将 aboutMeInfo 移到组件内部，这样可以访问组件的状态和函数

// 定义 Stats 类型以解决找不到名称的问题
type Stats = {
  posts: number;
  comments: number;
  likes: number;
};
interface Post {
  id: string | number;
  content: string;
  createdAt: string;
  _count: {
    comments: number;
    postLikes: number;
  };
}


// 通知接口定义
interface Notification {
  id: number
  content: string
  isRead: boolean
  createdAt: string
  post: {
    id: number
    title?: string
  }
  comment?: {
    id: number
    content: string
  } | null
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [activeFeature, setActiveFeature] = useState('likes')

  const [stats, setStats] = useState<Stats>({
    posts: 0,
    comments: 0,
    likes: 0,
  })
  // 由于找不到 Post 类型，这里先定义一个通用的 Post 类型，你可以根据实际情况修改

  const [likedPosts, setLikedPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 使用 useSWR 获取通知数据
  const { data: notificationData, isLoading: notificationLoading } = useSWR(
    session?.user?.id && activeFeature === 'notifications' ? '/api/users/notifications' : null,
    fetcher,
    {
      refreshInterval: 60000, // 每分钟刷新一次
      revalidateOnFocus: false,
    }
  )

  const notifications = notificationData?.notifications || []
  const unreadCount = notificationData?.unreadCount || 0

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

  // 标记所有通知为已读
  const markAllAsRead = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/users/notifications/read-all', {
        method: 'PUT',
      })
      if (response.ok) {
        // 使用 mutate 更新 SWR 缓存
        mutate('/api/users/notifications', {
          notifications: notifications.map(notification => ({
            ...notification,
            isRead: true
          })),
          unreadCount: 0
        }, false)

        // 触发重新验证以确保数据同步
        mutate('/api/users/notifications')
      }
    } catch (error) {
      console.error('标记通知已读失败:', error)
    }
  }

  // 渲染通知列表
  const renderNotifications = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="divide-y divide-neutral-100"
    >
      {/* 通知操作栏 */}
      {notifications.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <BellOutlined className="w-5 h-5 text-primary" />
            <span className="font-medium text-gray-900">通知列表</span>
            {unreadCount > 0 && (
              <Badge count={unreadCount} size="small" />
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              全部标为已读
            </button>
          )}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4 opacity-80"
          >
            🔔
          </motion.div>
          <div className="text-neutral-400 text-lg">暂无通知</div>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors"
          >
            去社区看看
            <RightOutlined className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={`/community/${notification.post.id}`}
              className={`block px-6 py-4 hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-primary-50 border-l-4 border-primary' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    !notification.isRead ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-1">{notification.content}</p>
                  <p className="text-xs text-gray-500">
                    {dayjs(notification.createdAt).format('YYYY年MM月DD日 HH:mm')}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))
      )}
    </motion.div>
  )

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
            <RightOutlined className="w-4 h-4" />
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
            <div className="relative px-8 py-6 hover:bg-neutral-50/50 transition-colors">
              <Link
                href={`/community/${post.id}`}
                target="_blank"
                className="block absolute inset-0 z-0"
              ></Link>
              <div className="flex items-start gap-4 relative z-10">
                <div className="flex-1 min-w-0">
                  <p className="text-neutral-900 text-sm line-clamp-3 mb-3 leading-relaxed font-medium">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span>{dayjs(post.createdAt).format('YYYY年MM月DD日')}</span>
                    <span className="flex items-center gap-1.5">
                      <MessageOutlined className="w-3.5 h-3.5" />
                      {post._count.comments} 条评论
                    </span>
                    <div className="relative z-20">
                      <LikeButton
                        postId={post.id}
                        initialLikes={post._count.postLikes}
                        className="!gap-1 !text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  )

  // Tabs 配置
  const aboutMeInfo: TabsProps['items'] = [
    {
      key: 'likes',
      label: '我的点赞',
      children: isLoading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : (
        renderPosts(likedPosts)
      ),
    },
    {
      key: 'notifications',
      label: (
        <div className="flex items-center gap-2">
          我的通知
          {unreadCount > 0 && (
            <Badge count={unreadCount} size="small" />
          )}
        </div>
      ),
      children: notificationLoading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : (
        renderNotifications()
      ),
    },
    {
      key: 'collections',
      label: '我的收藏',
      children: <div className="text-center py-8 text-gray-500">功能开发中...</div>,
    },
    {
      key: 'learning',
      label: '学习记录',
      children: <div className="text-center py-8 text-gray-500">功能开发中...</div>,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Tabs
        defaultActiveKey="likes"
        items={aboutMeInfo}
        onChange={(key) => setActiveFeature(key)}
        className="px-4"
      />
    </div>
  );
}