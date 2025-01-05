import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(doctors)
  } catch (error) {
    return NextResponse.json(
      { error: '获取医生列表失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 