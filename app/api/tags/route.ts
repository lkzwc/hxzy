import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取所有标签及其频率
export async function GET(request: NextRequest) {
  try {
    // 获取所有已发布的帖子的标签
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { tags: true },
    })

    // 统计每个标签的出现频率
    const tagFrequency: Record<string, number> = {}
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
      })
    })

    // 转换为词云所需的格式 [{text: '标签名', value: 频率}]
    const tagCloud = Object.entries(tagFrequency).map(([text, value]) => ({
      text,
      value,
    }))

    // 按频率排序
    tagCloud.sort((a, b) => b.value - a.value)


    // 设置缓存控制
    const headers = new Headers()
    headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

    return NextResponse.json(
      {
        tags: tagCloud,
      },
      {
        headers,
        status: 200,
      }
    )
  } catch (error) {
    console.error('获取标签数据失败:', error)
    return NextResponse.json(
      { error: '获取标签数据失败' },
      { status: 500 }
    )
  }
}