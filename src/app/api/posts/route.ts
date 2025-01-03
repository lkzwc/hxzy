import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    // 构建查询条件
    const where: Prisma.PostWhereInput = {
      published: true,
      ...(tag && { tags: { has: tag } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    }

    // 获取总数
    const total = await prisma.post.count({ where })

    // 获取帖子列表
    const posts = await prisma.$transaction(async (tx) => {
      const results = await tx.post.findMany({
        where,
        include: {
          author: true,
          comments: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      })

      // 格式化返回数据
      return results.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        views: post.views,
        likes: post.likes,
        tags: post.tags,
        author: {
          id: post.author.id,
          name: post.author.name,
          image: post.author.image,
        },
        _count: {
          comments: post.comments.length
        }
      }))
    })

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: '获取帖子列表失败' },
      { status: 500 }
    )
  }
} 