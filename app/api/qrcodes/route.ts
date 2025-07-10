import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const qrCodes = await prisma.adQrcode.findMany({
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json(qrCodes);
  } catch (error) {
    console.error('Error fetching QR codes:', error || 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to fetch QR codes' },
      { status: 500 }
    );
  }
} 