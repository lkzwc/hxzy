'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { RedoOutlined,MessageOutlined } from '@ant-design/icons'
import ImageUpload from './PublishToolbar'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Comment {
  id: number
  content: string
  createdAt: string
  author: {
    id: number
    name: string | null
    image: string | null
  }
  images: string[]
  replies?: Comment[]
  parentId: number | null
}

interface CommentSectionProps {
  postId: number
  comments: Comment[]
  onCommentAdded?: (comment: Comment) => void
}

export default function CommentSection({
  postId,
  comments,
  onCommentAdded,
}: CommentSectionProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<{
    id: number
    name: string | null
    parentId: number | null
  } | null>(null)
  const replyInputRef = useRef<HTMLTextAreaElement>(null)


  // 处理图片变化
  const handleImageChange = (urls: string[]) => {
    setImages(urls)
  }

  // 提交评论
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    if (!content.trim()) return

    // 验证内容长度
    if (content.trim().length > 200) {
      alert('评论内容不能超过200字')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          images,
          parentId: replyTo?.parentId ?? null,
        }),
      })

      if (!res.ok) {
        throw new Error('发布评论失败')
      }

      const newComment = await res.json()
      setContent('')
      setImages([])
      setReplyTo(null)
      onCommentAdded?.(newComment)
    } catch (error) {
      console.error('发布评论失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理回复
  const handleReply = (comment: Comment) => {
    setReplyTo({
      id: comment.id,
      name: comment.author.name,
      parentId: comment.parentId || comment.id,
    })
    replyInputRef.current?.focus()
  }

  // 取消回复
  const handleCancelReply = () => {
    setReplyTo(null)
    setContent('')
  }

  // 渲染评论输入框
  const renderCommentInput = () => {
    if (!session) {
      return (
        <div className="alert bg-base-200">
          <span>请先登录后再发表评论</span>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-3">
          <div className="relative flex-shrink-0  w-8 h-8">
            <Image
              src={session.user?.image || '/images/default-avatar.png'}
              alt={session.user?.name || '用户'}
              fill
              className="rounded-full object-cover ring-2 ring-base-200 "
            />
          </div>
          <div className="flex-1">
            {replyTo && (
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <span>回复</span>
                <span className="font-medium text-primary">{replyTo.name || '匿名用户'}</span>
                <button
                  type="button"
                  onClick={handleCancelReply}
                  className="ml-1 p-0.5 hover:bg-base-200 rounded-full transition-colors"
                >
                  <RedoOutlined className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="relative bg-base-100 rounded-xl shadow-sm border border-base-200 transition-all hover:border-base-300 focus-within:border-primary/30 focus-within:shadow-md">
              <textarea
                ref={replyInputRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={replyTo ? `回复 ${replyTo.name || '匿名用户'}...` : "写下你的评论..."}
                className="w-full min-h-[100px] p-4 bg-transparent rounded-xl resize-none focus:outline-none text-base placeholder:text-gray-400"
              />
              <div className="px-4 pb-4">
                <ImageUpload
                  type="comment"
                  value={images}
                  onChange={handleImageChange}
                  maxCount={1}
                />
              </div>
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!content.trim() && images.length === 0}
                  className="px-4 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-focus disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  // 渲染评论列表
  const renderComments = () => {
    if ((comments ?? []).length === 0) {
      return <div className="text-center py-8 text-gray-500">暂无评论</div>
    }

    // 分组评论：顶级评论和回复
    const topLevelComments = comments.filter(c => !c.parentId)
    const replies = comments.filter(c => c.parentId)
    const replyMap = new Map<number, Comment[]>()
    
    replies.forEach(reply => {
      const parentId = reply.parentId!
      if (!replyMap.has(parentId)) {
        replyMap.set(parentId, [])
      }
      replyMap.get(parentId)!.push(reply)
    })

    return topLevelComments.map(comment => {
      const replies = replyMap.get(comment.id) || []
      
      return (
        <div key={comment.id} className="space-y-4">
          <div className="flex gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src={comment.author.image || '/images/default-avatar.png'}
                alt={comment.author.name || '匿名用户'}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.author.name || '匿名用户'}</span>
                <span className="text-sm text-gray-500">
                  {dayjs(comment.createdAt).locale('zh-cn').fromNow()}
                </span>
              </div>
              <p className="mt-1">{comment.content}</p>
              {comment.images && comment.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {comment.images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`评论图片 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 flex items-center gap-4">
                <button
                  onClick={() => handleReply(comment)}
                  className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                >
                  <MessageOutlined className="w-5 h-5"/>
                  回复
                </button>
              </div>
            </div>
          </div>
          {replies.length > 0 && (
            <div className="ml-14 space-y-4 border-l-2 border-base-200 pl-4">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={reply.author.image || '/images/default-avatar.png'}
                      alt={reply.author.name || '匿名用户'}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{reply.author.name || '匿名用户'}</span>
                      <span className="text-sm text-gray-500">
                        {dayjs(reply.createdAt).locale('zh-cn').fromNow()}
                      </span>
                    </div>
                    <p className="mt-1">{reply.content}</p>
                    {reply.images && reply.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {reply.images.map((image, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`回复图片 ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-4">
                      <button
                        onClick={() => handleReply(reply)}
                        className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                      >
                        <MessageOutlined className="w-5 h-5" />
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="space-y-6">
      {renderCommentInput()}
      <div className="space-y-6">
        {renderComments()}
      </div>
    </div>
  )
}