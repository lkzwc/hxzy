import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

// 简单的内存缓存（生产环境建议使用 Redis）
declare global {
  var notificationCache: Map<string, { data: any; timestamp: number }> | undefined;
}

if (!global.notificationCache) {
  global.notificationCache = new Map();
}

const CACHE_TTL = 30000; // 30秒缓存

// 获取用户通知列表
export async function GET(req: NextRequest) {
  try {
    // 获取当前登录用户
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 获取当前用户ID
    const userId = Number(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: '无效的用户ID' }, { status: 400 });
    }

    // 检查缓存
    const cacheKey = `notifications_${userId}`;
    const cached = global.notificationCache?.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // 并行执行查询以提高性能
    const [notifications, unreadCount] = await Promise.all([
      // 获取用户的通知列表
      prisma.notification.findMany({
        where: { userId: userId },
        select: {
          id: true,
          content: true,
          isRead: true,
          createdAt: true,
          post: {
            select: {
              id: true,
            },
          },
          comment: {
            select: {
              id: true,
              content: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50, // 限制返回数量
      }),

      // 获取未读通知数量
      prisma.notification.count({
        where: {
          userId: userId,
          isRead: false,
        },
      })
    ]);

    const result = {
      notifications,
      unreadCount,
    };

    // 存储到缓存
    global.notificationCache?.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('获取通知失败:', error);
    return NextResponse.json({ error: '获取通知失败' }, { status: 500 });
  }
}