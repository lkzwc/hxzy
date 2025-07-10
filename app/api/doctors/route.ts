import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // 获取URL参数
    const { searchParams } = new URL(request.url)
    const province = searchParams.get('province')
    const specialty = searchParams.get('specialty')
    const search = searchParams.get('search')
    
    // 构建查询条件
    const whereClause: any = {}
    
    if (province && province !== '全部') {
      whereClause.province = province
    }
    
    if (specialty && specialty !== '全部') {
      whereClause.specialty = specialty
    }
    
    // 添加模糊搜索条件
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { hospital: { contains: search, mode: 'insensitive' } },
        { specialty: { contains: search, mode: 'insensitive' } },
        { introduction: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({ 
      success: true,
      data: doctors 
    })
  } catch (error) {
    console.error('获取医生列表失败:', error || 'Unknown error')
    return NextResponse.json(
      {
        success: false,
        error: '获取医生列表失败',
        details: error instanceof Error ? error.message : String(error || 'Unknown error')
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 验证必填字段
    const requiredFields = ['name', 'department', 'hospital', 'specialty', 'phone', 'province', 'introduction']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `${field} 是必填字段` 
          },
          { status: 400 }
        )
      }
    }
    
    // 处理specialty字段，如果是数组则转换为字符串
    const specialty = Array.isArray(body.specialty) ? body.specialty.join(', ') : body.specialty
    
    // 创建新医生记录
    const newDoctor = await prisma.doctor.create({
      data: {
        name: body.name,
        department: body.department,
        hospital: body.hospital,
        specialty: specialty,
        phone: body.phone,
        province: body.province,
        introduction: body.introduction,
        avatar: body.avatar || null,
        attachmentUrls: body.attachmentUrls || []
      }
    })
    
    return NextResponse.json({ 
      success: true,
      data: newDoctor,
      message: '医生信息提交成功'
    })
  } catch (error) {
    console.error('创建医生记录失败:', error || 'Unknown error')
    return NextResponse.json(
      {
        success: false,
        error: '创建医生记录失败',
        details: error instanceof Error ? error.message : String(error || 'Unknown error')
      },
      { status: 500 }
    )
  }
}