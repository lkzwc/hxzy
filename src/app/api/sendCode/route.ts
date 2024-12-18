import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    // 1. 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: '手机号格式错误' }, { status: 400 });
    }

    // 2. 生成验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. 存储验证码（这里应该使用 Redis 等缓存服务）
    // await redis.set(`verify_code:${phone}`, code, 'EX', 300); // 5分钟有效期

    // 4. 调用短信服务发送验证码
    // await sendSMS(phone, code);

    // 开发环境直接返回验证码
    console.log(`验证码：${code}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '发送失败' }, { status: 500 });
  }
} 