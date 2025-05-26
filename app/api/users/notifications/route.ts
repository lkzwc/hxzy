import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

// 获取用户通知列表
export async function GET(req: NextRequest) {
  try {
    // 获取当前登录用户
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 获取当前用户ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 获取用户的通知列表
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
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
        userId: user.id,
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