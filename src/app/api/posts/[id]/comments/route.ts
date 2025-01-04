import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/app/lib/prisma'

// 获取评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id)
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '无效的帖子ID' },
        { status: 400 }
      )
    }

    // 获取帖子的所有评论(包括回复)
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // 只获取顶级评论
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            likedBy: {
              select: {
                userId: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likedBy: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('获取评论失败:', error)
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    )
  }
}

// 发表评论
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

    const { content, parentId, images } = await request.json()

    // 验证评论内容
    if (!content?.trim()) {
      return NextResponse.json(
        { error: '评论内容不能为空' },
        { status: 400 }
      )
    }

    // 如果是回复评论，检查父评论是否存在
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      })
      if (!parentComment) {
        return NextResponse.json(
          { error: '回复的评论不存在' },
          { status: 404 }
        )
      }
      // 检查父评论是否属于当前帖子
      if (parentComment.postId !== postId) {
        return NextResponse.json(
          { error: '回复的评论不属于当前帖子' },
          { status: 400 }
        )
      }
    }

    // 创建评论
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        images: images || [],
        postId,
        authorId: session.user.id,
        parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likedBy: {
          select: {
            userId: true,
          },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('发表评论失败:', error)
    return NextResponse.json(
      { error: '发表评论失败' },
      { status: 500 }
    )
  }
} 