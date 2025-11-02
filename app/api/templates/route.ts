import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const style = searchParams.get('style') || ''
    const userId = searchParams.get('userId') || 'anonymous'

    // Build where clause
    const where: {
      userId: string
      title?: { contains: string; mode?: 'insensitive' }
      style?: string
    } = {
      userId,
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      }
    }

    if (style && ['Minimal', 'Bold', 'Soft', 'Dark'].includes(style)) {
      where.style = style
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        prompt: true,
        style: true,
        framerUrl: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch templates',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

