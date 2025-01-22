'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import useSWR from 'swr'

interface LikeButtonProps {
  postId: number
  initialLikes?: number
  className?: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function LikeButton({ postId, initialLikes = 0, className = '' }: LikeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // 获取点赞状态
  const { data, mutate } = useSWR(
    session ? `/api/posts/${postId}/like` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  const likes = data?.likes ?? initialLikes
  const isLiked = data?.isLiked ?? false

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() // 阻止链接跳转
    e.stopPropagation() // 阻止事件冒泡

    if (!session) {
      router.push('/api/auth/signin')
      return
    }

    if (isLoading) return

    try {
      setIsLoading(true)
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })

      if (!res.ok) throw new Error('Failed to like')

      // 更新本地状态
      mutate()
    } catch (error) {
      console.error('点赞失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`group flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors ${className}`}
    >
      <Heart
        className={`w-4 h-4 flex-shrink-0 transition-colors ${
          isLiked ? 'fill-current text-primary' : 'group-hover:text-primary'
        }`}
      />
      <span className='text-sm'>{likes}</span>
    </button>
  )
} 