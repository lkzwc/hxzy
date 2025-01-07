'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Like } from '@icon-park/react'

interface LikeButtonProps {
  type: 'post' | 'comment'
  itemId: number
  initialLikes: number
}

export default function LikeButton({
  type,
  itemId,
  initialLikes,
}: LikeButtonProps) {
  const { data: session } = useSession()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 点赞
  const handleLike = async () => {
    if (!session) return
    if (isLoading) return

    setIsLoading(true)
    try {
      const endpoint = type === 'post'
        ? `/api/posts/${itemId}/like`
        : `/api/comments/${itemId}/like`

      const res = await fetch(endpoint, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('点赞失败')
      }

      const data = await res.json()
      setLikes(data.likes)
      setIsLiked(data.isLiked)
    } catch (error) {
      console.error('点赞失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading || !session}
      className={`flex items-center gap-1 transition-colors ${
        isLiked ? 'text-primary' : 'text-gray-500 hover:text-primary'
      }`}
    >
      <Like theme="outline" size="16" />
      {likes > 0 && likes}
    </button>
  )
} 