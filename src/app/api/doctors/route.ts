import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({ 
      success: true,
      data: doctors 
    })
  } catch (error) {
    console.error('获取医生列表失败:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '获取医生列表失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 