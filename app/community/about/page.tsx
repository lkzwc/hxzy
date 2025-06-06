'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { HeartOutlined, StarOutlined, BookOutlined, MessageOutlined, RightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import Link from 'next/link'
import LikeButton from '@/components/LikeButton'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsProps } from 'antd'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')



const aboutMeInfo: TabsProps['items'] = [
  {
    key: '1',
    label: '我的点赞',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: '我的通知',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: '我的收藏',
    children: 'Content of Tab Pane 3',
  },
  {
    key: '4',
    label: '学习记录',
    children: 'Content of Tab Pane 3',
  },
];

// 定义 Stats 类型以解决找不到名称的问题
type Stats = {
  posts: number;
  comments: number;
  likes: number;
};
interface Post {
  id: string | number;
  title: string;
  content: string;
  createdAt: string;
  _count: {
    comments: number;
    postLikes: number;
  };
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
                  <h3 className="text-base font-medium text-neutral-900 mb-2 line-clamp-1">{post.title}</h3>
                  <p className="text-neutral-500 text-sm line-clamp-2 mb-3 leading-relaxed">{post.content}</p>
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

  return <Tabs defaultActiveKey="1" items={aboutMeInfo} />;
}