import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/app/lib/prisma'

// 点赞/取消点赞帖子
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
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
      where: { id: postId },
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
          userId: session.user.id,
          postId,
        },
      },
    })

    if (existingLike) {
      // 取消点赞
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
      })
      return NextResponse.json({ liked: false })
    } else {
      // 添加点赞
      await prisma.postLike.create({
        data: {
          userId: session.user.id,
          postId,
        },
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('点赞帖子失败:', error)
    return NextResponse.json(
      { error: '点赞帖子失败' },
      { status: 500 }
    )
  }
} 