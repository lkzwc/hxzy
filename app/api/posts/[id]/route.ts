import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取帖子详情
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const postId = parseInt(params.id)
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '无效的帖子ID' },
        { status: 400 }
      )
    }

    // 获取帖子信息
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        images: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        views: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            images: true,
            createdAt: true,
            parentId: true,
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

    // 获取点赞数
    const likesCount = await prisma.postLike.count({
      where: {
        postId,
      },
    })

    // 增加浏览量
    await prisma.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    // 格式化响应数据
    const formattedPost = {
      ...post,
      likes: likesCount,
    }

    return NextResponse.json(formattedPost)
  } catch (error) {
    console.error('获取帖子详情失败:', error)
    console.error('错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取帖子详情失败' },
      { status: 500 }
    )
  }
}

// 添加评论
export async function POST(
  request: Request,
  { params }: any
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