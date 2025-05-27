import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

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

    // 获取用户的通知列表
    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      include: {
        post: {
          select: {
            id: true,
            title: true,
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
    });

    // 获取未读通知数量
    const unreadCount = await prisma.notification.count({
      where: {
        userId: userId,
        isRead: false,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('获取通知失败:', error);
    return NextResponse.json({ error: '获取通知失败' }, { status: 500 });
  }
}