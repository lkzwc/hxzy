import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'

export async function GET(
  request: NextRequest,
  params: any
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const postId = parseInt(params.id)
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '无效的帖子ID' },
        { status: 400 }
      )
    }

    // 获取帖子点赞状态
    const like = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: parseInt(session.user.id || '0'),
          postId,
        },
      },
    })

    // 获取帖子点赞数
    const likes = await prisma.postLike.count({
      where: {
        postId,
      },
    })

    return NextResponse.json({
      isLiked: !!like,
      likes,
    })
  } catch (error) {
    console.error('获取帖子点赞状态失败:', error)
    return NextResponse.json(
      { error: '获取帖子点赞状态失败' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  params: any
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const postId = parseInt(params.id)
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '无效的帖子ID' },
        { status: 400 }
      )
    }

    // 检查帖子是否存在
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      )
    }

    // 检查是否已点赞
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: parseInt(session.user.id || '0'),
          postId,
        },
      },
    })

    if (existingLike) {
      // 取消点赞
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId: parseInt(session.user.id || '0'),
            postId,
          },
        },
      })
    } else {
      // 添加点赞
      await prisma.postLike.create({
        data: {
          userId: parseInt(session.user.id || '0'),
          postId,
        },
      })
    }

    // 获取最新点赞数
    const likes = await prisma.postLike.count({
      where: {
        postId,
      },
    })

    return NextResponse.json({
      isLiked: !existingLike,
      likes,
    })
  } catch (error) {
    console.error('帖子点赞失败:', error)
    return NextResponse.json(
      { error: '帖子点赞失败' },
      { status: 500 }
    )
  }
}