import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // 获取用户点赞的帖子列表
    const likes = await prisma.postLike.findMany({
      where: {
        userId
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            _count: {
              select: {
                comments: true,
                postLikes: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // 获取总数
    const total = await prisma.postLike.count({
      where: {
        userId
      }
    })

    // 转换响应格式
    const formattedPosts = likes.map(like => ({
      id: like.post.id,
      title: like.post.title,
      content: like.post.content,
      coverImage: like.post.images[0],
      createdAt: like.post.createdAt,
      views: like.post.views,
      author: like.post.author,
      likedAt: like.createdAt,
      _count: {
        likes: like.post._count.postLikes,
        comments: like.post._count.comments
      }
    }))

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取用户点赞列表失败:', error)
    return NextResponse.json(
      { error: '获取用户点赞列表失败' },
      { status: 500 }
    )
  }
} 