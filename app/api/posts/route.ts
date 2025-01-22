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
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: WhereInput = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(tag && { tags: { has: tag } }),
    }

    // 获取帖子列表和下一页数据
    const [posts, nextPagePosts] = await Promise.all([
      prisma.post.findMany({
        where: where as any, // 使用类型断言避免类型错误
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
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.post.findMany({
        where: where as any, // 使用类型断言避免类型错误
        select: { id: true },
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' },
        ],
        skip: skip + limit,
        take: 1,
      }),
    ])

    // 设置缓存控制
    const headers = new Headers()
    headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

    return NextResponse.json(
      {
        posts,
        hasMore: nextPagePosts.length > 0,
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

    const { title, content, tags, images } = await request.json()

    // 验证数据
    if (!title?.trim()) {
      return NextResponse.json(
        { error: '标题不能为空' },
        { status: 400 }
      )
    }
    if (!content?.trim()) {
      return NextResponse.json(
        { error: '内容不能为空' },
        { status: 400 }
      )
    }
    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: '请至少选择一个标签' },
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
        title: title.trim(),
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