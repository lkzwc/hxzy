'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { BellOutlined } from '@ant-design/icons'
import useSWR, { mutate } from 'swr'

// Fetcher 函数
const fetcher = (url: string) => fetch(url).then((res) => res.json())

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

export default function NotificationBadge() {
  const { data: session, status } = useSession()
  console.log("status",status)
  const [showDropdown, setShowDropdown] = useState(false)

  // 使用 useSWR 获取通知数据
  const { data: notificationData, error, isLoading } = useSWR(
    status === 'authenticated' ? '/api/users/notifications' : null,
    fetcher,
    {
      refreshInterval: 6000, // 每分钟刷新一次
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  const notifications = notificationData?.notifications || []
  const unreadCount = notificationData?.unreadCount || 0

  // 标记所有通知为已读
  const markAllAsRead = async () => {
    if (status !== 'authenticated' || !session) return

    try {
      const response = await fetch('/api/users/notifications/read-all', {
        method: 'PUT',
      })
      if (response.ok) {
        // 使用 mutate 更新 SWR 缓存
        mutate('/api/users/notifications', {
          notifications: notifications.map((notification: any) => ({
            ...notification,
            isRead: true
          })),
          unreadCount: 0
        }, false)

        // 同时触发全局的通知数据更新（用于导航栏）
        mutate('/api/users/notifications')
      }
    } catch (error) {
      console.error('标记通知已读失败:', error)
    }
  }

  // 如果未登录，不显示通知图标
  if (status !== 'authenticated' || !session) {
    return null
  }

  return (
    <div className="relative">
      {/* 通知图标和未读数量 */}
      <button
        onClick={() => {
          setShowDropdown(!showDropdown)
          if (!showDropdown && unreadCount > 0) {
            // 打开通知时自动标记为已读
            markAllAsRead()
          }
        }}
        className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        aria-label="通知"
      >
        <BellOutlined className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* 通知下拉菜单 */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">通知</h3>
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              全部标为已读
            </button>
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-gray-500">加载中...</div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification: Notification) => (
                <Link
                  key={notification.id}
                  href={`/community/${notification.post.id}`}
                  onClick={() => setShowDropdown(false)}
                  className={`block p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-primary-50' : ''}`}
                >
                  <p className="text-sm text-gray-700">{notification.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">暂无通知</div>
          )}
        </div>
      )}
    </div>
  )
}