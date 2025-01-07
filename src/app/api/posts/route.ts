import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/app/lib/prisma'
import { Prisma } from '@prisma/client'

// 获取帖子列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: Prisma.PostWhereInput = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { content: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ],
      }),
      ...(tag && { tags: { has: tag } }),
    }

    // 获取帖子列表
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
              postLikes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc' as Prisma.SortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
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
      where: { email: session.user.email! }
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
            postLikes: true,
          },
        },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('发布帖子失败:', error)
    return NextResponse.json(
      { error: '发布帖子失败' },
      { status: 500 }
    )
  }
} 