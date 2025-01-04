import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

// 获取帖子详情
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

    const post = await prisma.post.findUnique({
      where: { id: postId },
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
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      )
    }

    // 增加浏览量
    await prisma.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('获取帖子详情失败:', error)
    return NextResponse.json(
      { error: '获取帖子详情失败' },
      { status: 500 }
    )
  }
}

// 添加评论
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { content, authorId } = await request.json()

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(params.id),
        authorId: parseInt(authorId)
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: '添加评论失败' },
      { status: 500 }
    )
  }
} 