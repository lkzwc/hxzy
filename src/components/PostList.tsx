'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Like, Comment } from '@icon-park/react'

export default function PostList() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: '浅谈《伤寒论》太阳病篇的现代临床应用',
            content: '结合临床实践，探讨经方在现代疾病治疗中的应用价值，分享个人临证心得与体会...',
            tags: ['经方', '伤寒论', '临床'],
            likes: 128,
            comments: 32,
            author: {
              name: '张三丰',
              avatar: '/images/avatar-1.jpg'
            }
          },
          {
            title: '中医体质辨识与四季养生要点',
            content: '从中医体质学说出发，探讨不同体质人群的养生保健方法，结合四季特点进行调养...',
            tags: ['养生', '体质', '四季'],
            likes: 96,
            comments: 24,
            author: {
              name: '李四',
              avatar: '/images/avatar-2.jpg'
            }
          }
        ].map((post, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-gray-900">{post.author.name}</div>
                <div className="text-sm text-gray-500">中医师</div>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.content}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Like theme="outline" size="16" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <Comment theme="outline" size="16" />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 