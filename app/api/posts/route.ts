import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { prisma } from '@/lib/prisma'

type WhereInput = {
  published: boolean
  OR?: {
    title?: { contains: string; mode: 'insensitive' }
    content?: { contains: string; mode: 'insensitive' }
  }[]
  tags?: { has: string }
}

// 获取帖子列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20) // 限制最大20条
    const skip = (page - 1) * limit

    // 简单的内存缓存键
    const cacheKey = `posts:${page}:${limit}:${search || ''}:${tag || ''}`

    // 构建查询条件
    const where: WhereInput = {
      published: true,
      ...(search && {
        content: { contains: search, mode: 'insensitive' },
      }),
      ...(tag && { tags: { has: tag } }),
    }

    // 优化查询：只获取必要的数据，减少关联查询
    const posts = await prisma.post.findMany({
      where: where as any,
      select: {
        id: true,
        content: true,
        createdAt: true,
        views: true,
        tags: true,
        images: true,
        authorId: true,
        // 移除 _count 查询，改为单独查询或缓存
      },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
      skip,
      take: limit + 1, // 多取一条来判断是否有更多数据
    })

    // 判断是否有更多数据
    const hasMore = posts.length > limit
    const actualPosts = hasMore ? posts.slice(0, limit) : posts

    // 获取作者信息（批量查询）
    const authorIds = [...new Set(actualPosts.map(post => post.authorId))]
    const authors = await prisma.user.findMany({
      where: { id: { in: authorIds } },
      select: { id: true, name: true, image: true }
    })

    // 获取评论数（批量查询）
    const postIds = actualPosts.map(post => post.id)
    const commentCounts = await prisma.comment.groupBy({
      by: ['postId'],
      where: { postId: { in: postIds } },
      _count: { id: true }
    })

    // 组装数据
    const postsWithDetails = actualPosts.map(post => {
      const author = authors.find(a => a.id === post.authorId)
      const commentCount = commentCounts.find(c => c.postId === post.id)?._count.id || 0

      return {
        ...post,
        author: author || { id: post.authorId, name: null, image: null },
        _count: { comments: commentCount }
      }
    })

    // 设置更积极的缓存控制
    const headers = new Headers()
    headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300')
    headers.set('CDN-Cache-Control', 'public, s-maxage=60')

    return NextResponse.json(
      {
        posts: postsWithDetails,
        hasMore,
      },
      {
        headers,
        status: 200,
      }
    )
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    return NextResponse.json(
      { error: '获取帖子列表失败' },
      { status: 500 }
    )
  }
}

// 发布帖子
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { content, tags, images } = await request.json()

    // 验证数据
    if (!content?.trim()) {
      return NextResponse.json(
        { error: '内容不能为空' },
        { status: 400 }
      )
    }
    // 标签验证 - 允许空标签但必须是数组
    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { error: '标签格式错误' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 创建帖子
    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        tags: tags as string[],
        images: images || [],
        authorId: user.id,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    // 清除缓存
    const revalidateHeaders = new Headers()
    revalidateHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate')

    return NextResponse.json(
      post,
      {
        headers: revalidateHeaders,
        status: 201,
      }
    )
  } catch (error) {
    console.error('发布帖子失败:', error)
    return NextResponse.json(
      { error: '发布帖子失败' },
      { status: 500 }
    )
  }
}