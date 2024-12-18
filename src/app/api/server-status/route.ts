import { NextResponse } from 'next/server';

// 服务器启动时间
const startTime = Date.now();

export async function GET() {
  try {
    // 计算运行时间（秒）
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    
    // 模拟服务器余额（实际应该从数据库获取）
    const balance = 1000.00;

    return NextResponse.json({ uptime, balance });
  } catch (error) {
    return NextResponse.json(
      { error: '获取服务器状态失败' },
      { status: 500 }
    );
  }
} 