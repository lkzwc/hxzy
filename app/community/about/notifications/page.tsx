'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { BellOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: number
  content: string
  isRead: boolean
  createdAt: string
  post: {
    id: number
    title: string
  }
  comment?: {
    id: number
    content: string
  } | null
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 获取通知列表
  useEffect(() => {
    if (session?.user?.id) {
      setIsLoading(true)
      fetch('/api/users/notifications')
        .then(res => res.json())
        .then(data => {
          setNotifications(data.notifications || [])
        })
        .catch(error => {
          console.error('获取通知失败:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [session?.user?.id])

  // 标记所有通知为已读
  const markAllAsRead = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/users/notifications/read-all', {
        method: 'PUT',
      })
      if (response.ok) {
        // 更新本地通知状态
        setNotifications(prev => 
          prev.map(notification => ({
            ...notification,
            isRead: true
          }))
        )
      }
    } catch (error) {
      console.error('标记通知已读失败:', error)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      {/* 顶部背景 */}
      <div className="h-[140px] bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 -mt-32">
        {/* 通知列表卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-neutral-100/50 backdrop-blur-sm 
            bg-white/60 p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <BellOutlined className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-bold text-neutral-900">我的通知</h1>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
              >
                全部标为已读
              </button>
            )}
          </div>

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
            ) : notifications.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-neutral-100"
              >
                {notifications.map((notification: any) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`relative px-4 py-4 hover:bg-neutral-50/50 transition-colors ${!notification.isRead ? 'bg-primary-50/50' : ''}`}
                  >
                    <Link
                      href={`/community/${notification.post.id}`}
                      className="block"
                    >
                      <p className="text-neutral-800 mb-1">{notification.content}</p>
                      <p className="text-primary-600 text-sm mb-2">帖子: {notification.post.title}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(notification.createdAt).toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
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
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}