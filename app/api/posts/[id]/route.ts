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

    // 优化：分离帖子信息和评论查询，避免一次性加载所有评论
    const [post, commentCount] = await Promise.all([
      // 获取帖子基本信息
      prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
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
        },
      }),
      // 只获取评论数量，评论内容通过单独的 API 获取
      prisma.comment.count({
        where: { postId: postId },
      })
    ])

    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      )
    }

    // 并行获取点赞数，优化性能
    const likesCount = await prisma.postLike.count({
      where: {
        postId,
      },
    })

    // 异步增加浏览量，不阻塞响应
    prisma.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    }).catch(error => {
      console.error('更新浏览量失败:', error || 'Unknown error')
    })

    // 格式化响应数据
    const formattedPost = {
      ...post,
      likes: likesCount,
      commentCount, // 添加评论数量
      views: post.views + 1, // 返回更新后的浏览量
    }

    return NextResponse.json(formattedPost)
  } catch (error) {
    console.error('获取帖子详情失败:', error || 'Unknown error')
    console.error('错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取帖子详情失败' },
      { status: 500 }
    )
  }
}

// 注意：评论功能已迁移至 /api/posts/[id]/comments/route.ts（含鉴权）
// 此路由仅保留 GET 用于获取帖子详情