import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
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

    // 获取用户帖子列表
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
            postLikes: true,
          },
        },
      },
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('获取用户帖子列表失败:', error)
    return NextResponse.json(
      { error: '获取用户帖子列表失败' },
      { status: 500 }
    )
  }
} 