import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from '@/lib/prisma';

// 标记所有通知为已读
export async function PUT(req: NextRequest) {
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

    // 将用户的所有未读通知标记为已读
    await prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('标记通知已读失败:', error);
    return NextResponse.json({ error: '标记通知已读失败' }, { status: 500 });
  }
}