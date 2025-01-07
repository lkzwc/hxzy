import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/app/lib/prisma'

// 点赞/取消点赞评论
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const commentId = parseInt(params.id)
    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: '无效的评论ID' },
        { status: 400 }
      )
    }

    // 检查评论是否存在
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    })

    if (!comment) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      )
    }

    // 检查是否已点赞
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: parseInt(session.user.id),
          commentId,
        },
      },
    })

    if (existingLike) {
      // 取消点赞
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId: parseInt(session.user.id),
            commentId,
          },
        },
      })
    } else {
      // 添加点赞
      await prisma.commentLike.create({
        data: {
          userId: parseInt(session.user.id),
          commentId,
        },
      })
    }

    // 获取最新点赞数
    const likes = await prisma.commentLike.count({
      where: {
        commentId,
      },
    })

    return NextResponse.json({
      isLiked: !existingLike,
      likes,
    })
  } catch (error) {
    console.error('评论点赞失败:', error)
    return NextResponse.json(
      { error: '评论点赞失败' },
      { status: 500 }
    )
  }
}

// 获取评论点赞状态
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const commentId = parseInt(params.id)
    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: '无效的评论ID' },
        { status: 400 }
      )
    }

    // 获取评论点赞状态
    const like = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: parseInt(session.user.id),
          commentId,
        },
      },
    })

    // 获取评论点赞数
    const likes = await prisma.commentLike.count({
      where: {
        commentId,
      },
    })

    return NextResponse.json({
      isLiked: !!like,
      likes,
    })
  } catch (error) {
    console.error('获取评论点赞状态失败:', error)
    return NextResponse.json(
      { error: '获取评论点赞状态失败' },
      { status: 500 }
    )
  }
} 