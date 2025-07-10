import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

interface CommentWithDetails {
  id: number
  content: string
  images: string[]
  createdAt: Date
  parentId: number | null
  author: {
    id: number
    name: string | null
    image: string | null
  }
}

interface CommentResponse {
  id: number
  content: string
  images: string[]
  createdAt: Date
  author: {
    id: number
    name: string | null
    image: string | null
  }
  parentId: number | null
  replyTo?: {
    id: number
    name: string | null
  } | null
}

// 获取评论列表
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const postId = parseInt(params?.id)
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '无效的帖子ID' },
        { status: 400 }
      )
    }

    // 获取所有评论
    const comments = await prisma.comment.findMany({
      where: { postId },
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
    }) as CommentWithDetails[]

    // 优化：批量获取父评论信息，避免 N+1 查询
    const parentIds = [...new Set(comments.filter(c => c.parentId).map(c => c.parentId!))]
    const parentComments = parentIds.length > 0 ? await prisma.comment.findMany({
      where: { id: { in: parentIds } },
      select: {
        id: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }) : []

    // 创建父评论映射
    const parentMap = new Map(parentComments.map(p => [p.id, p.author]))

    // 构建最终结果
    const commentsWithReplyInfo: CommentResponse[] = comments.map(comment => {
      let replyTo = null
      if (comment.parentId && parentMap.has(comment.parentId)) {
        const parentAuthor = parentMap.get(comment.parentId)!
        replyTo = {
          id: parentAuthor.id,
          name: parentAuthor.name,
        }
      }

      return {
        id: comment.id,
        content: comment.content,
        images: comment.images,
        createdAt: comment.createdAt,
        author: comment.author,
        parentId: comment.parentId,
        replyTo,
      }
    })

    // 按照父评论的创建时间和回复时间排序
    const sortedComments = commentsWithReplyInfo.sort((a, b) => {
      // 如果都是顶级评论，按创建时间倒序
      if (!a.parentId && !b.parentId) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      // 如果都是回复同一条评论，按创建时间正序
      if (a.parentId === b.parentId) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      // 如果是回复不同的评论，按父评论的创建时间倒序
      const aParent = commentsWithReplyInfo.find(c => c.id === a.parentId)
      const bParent = commentsWithReplyInfo.find(c => c.id === b.parentId)
      if (aParent && bParent) {
        return new Date(bParent.createdAt).getTime() - new Date(aParent.createdAt).getTime()
      }
      // 如果一个是顶级评论，一个是回复，顶级评论优先
      if (!a.parentId) return -1
      if (!b.parentId) return 1
      return 0
    })

    return NextResponse.json(sortedComments)
  } catch (error) {
    console.error('获取评论失败:', error || 'Unknown error')
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    )
  }
}

// 发表评论
export async function POST(
  request: NextRequest,
  { params }: any
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.error('发表评论失败: 用户未登录')
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user?.id!) }
    })

    if (!user) {
      console.error('发表评论失败: 用户不存在', { id: session.user?.id })
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    const postId = parseInt(params.id)
    if (isNaN(postId)) {
      console.error('发表评论失败: 无效的帖子ID', { id: params.id })
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
      console.error('发表评论失败: 帖子不存在', { postId })
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      )
    }

    const body = await request.json()
    console.log('评论请求数据:', body)
    const { content, parentId, images } = body

    // 验证评论内容
    if (!content?.trim()) {
      console.error('发表评论失败: 评论内容为空')
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
        console.error('发表评论失败: 回复的评论不存在', { parentId })
        return NextResponse.json(
          { error: '回复的评论不存在' },
          { status: 404 }
        )
      }
      // 检查父评论是否属于当前帖子
      if (parentComment.postId !== postId) {
        console.error('发表评论失败: 回复的评论不属于当前帖子', { parentId, postId })
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
        authorId: user.id,
        parentId: parentId || null,
      },
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
    })
    
    // 创建通知
    try {
      // 如果是回复评论，通知被回复的用户
      if (parentId) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: parentId },
          select: {
            authorId: true,
            content: true,
          },
        })
        
        // 不给自己发送通知
        if (parentComment && parentComment.authorId !== user.id) {
          await prisma.notification.create({
            data: {
              content: `${user.name || '有用户'} 回复了你的评论: ${content.length > 20 ? content.substring(0, 20) + '...' : content}`,
              userId: parentComment.authorId,
              postId,
              commentId: comment.id,
            },
          })
        }
      } 
      // 如果是评论帖子，通知帖子作者
      else {
        // 不给自己发送通知
        if (post.authorId !== user.id) {
          await prisma.notification.create({
            data: {
              content: `${user.name || '有用户'} 评论了你的帖子: ${content.length > 20 ? content.substring(0, 20) + '...' : content}`,
              userId: post.authorId,
              postId,
              commentId: comment.id,
            },
          })
        }
      }
    } catch (notificationError) {
      // 通知创建失败不影响评论创建
      console.error('创建通知失败:', notificationError)
    }


    const response: CommentResponse = {
      id: comment.id,
      content: comment.content,
      images: comment.images,
      createdAt: comment.createdAt,
      author: comment.author,
      parentId: comment.parentId,
    }

    // 如果是回复评论，添加被回复者信息
    if (comment.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: comment.parentId },
        select: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      if (parentComment) {
        response.replyTo = {
          id: parentComment.author.id,
          name: parentComment.author.name,
        }
      }
    }

    console.log('返回评论数据:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('发表评论失败:', error || 'Unknown error')
    // 如果是 Prisma 错误，返回更详细的错误信息
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Prisma 错误:', {
        code: error.code,
        message: error.message,
        meta: error.meta,
      })
      return NextResponse.json(
        { error: `数据库错误: ${error.code}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: '发表评论失败' },
      { status: 500 }
    )
  }
}