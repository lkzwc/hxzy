import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取用户统计信息
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const userId = parseInt(params.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '无效的用户ID' },
        { status: 400 }
      )
    }

    // 获取用户统计信息
    const [postsCount, commentsCount] = await Promise.all([
      prisma.post.count({
        where: {
          authorId: userId,
          published: true,
        },
      }),
      prisma.comment.count({
        where: {
          authorId: userId,
        },
      }),
    ])

    return NextResponse.json({
      posts: postsCount,
      comments: commentsCount,
    })
  } catch (error) {
    console.error('获取用户统计信息失败:', error || 'Unknown error')
    return NextResponse.json(
      { error: '获取用户统计信息失败' },
      { status: 500 }
    )
  }
} 