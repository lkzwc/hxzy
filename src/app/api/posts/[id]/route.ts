import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(params.id)
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      )
    }

    // 更新浏览量
    await prisma.post.update({
      where: { id: parseInt(params.id) },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: '获取帖子失败' },
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