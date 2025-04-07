import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // 获取用户点赞的帖子
    const likes = await prisma.postLike.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                comments: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    // 获取总数
    const total = await prisma.postLike.count({
      where: {
        userId,
      },
    })

    return NextResponse.json({
      likes: likes.map((like: any) => like.post),
      total,
      hasMore: skip + limit < total,
    })
  } catch (error) {
    console.error('获取用户点赞列表失败:', error)
    return NextResponse.json(
      { error: '获取用户点赞列表失败' },
      { status: 500 }
    )
  }
} 