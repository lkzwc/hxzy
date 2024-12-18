import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    // 1. 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: '手机号格式错误' }, { status: 400 });
    }

    // 2. 验证验证码
    // const savedCode = await redis.get(`verify_code:${phone}`);
    // if (!savedCode || savedCode !== code) {
    //   return NextResponse.json({ error: '验证码错误' }, { status: 400 });
    // }

    // 3. 查找或创建用户
    // const user = await prisma.user.upsert({
    //   where: { phone },
    //   update: {},
    //   create: { phone }
    // });

    // 4. 生成 JWT token
    const token = jwt.sign(
      { userId: 'test_user_id', phone },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
} 