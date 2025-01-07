import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取用户统计信息
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '无效的用户ID' },
        { status: 400 }
      )
    }

    // 获取用户统计数据
    const [posts, comments, likes] = await Promise.all([
      // 发帖数
      prisma.post.count({
        where: {
          authorId: userId,
        },
      }),
      // 评论数
      prisma.comment.count({
        where: {
          authorId: userId,
        },
      }),
      // 获赞数
      prisma.postLike.count({
        where: {
          post: {
            authorId: userId,
          },
        },
      }),
    ])

    return NextResponse.json({
      posts,
      comments,
      likes,
    })
  } catch (error) {
    console.error('获取用户统计数据失败:', error)
    return NextResponse.json(
      { error: '获取用户统计数据失败' },
      { status: 500 }
    )
  }
} 