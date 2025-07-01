import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 获取用户点赞的帖子
    const likedPosts = await prisma.post.findMany({
      where: {
        postLikes: {
          some: {
            userId: parseInt(params.id)
          }
        }
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
            postLikes: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ posts: likedPosts })
  } catch (error) {
    console.error('获取用户点赞帖子失败:', error)
    return NextResponse.json(
      { error: '获取用户点赞帖子失败' },
      { status: 500 }
    )
  }
} 