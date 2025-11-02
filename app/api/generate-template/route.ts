import { NextRequest, NextResponse } from 'next/server'
import { generateTemplateCode, type Style } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, style } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!style || !['Minimal', 'Bold', 'Soft', 'Dark'].includes(style)) {
      return NextResponse.json(
        { error: 'Valid style is required (Minimal, Bold, Soft, or Dark)' },
        { status: 400 }
      )
    }

    // Generate template code using OpenAI
    const { code, title } = await generateTemplateCode(
      prompt,
      style as Style
    )

    // Save to database (using placeholder userId for now)
    const template = await prisma.template.create({
      data: {
        userId: 'anonymous', // TODO: Replace with actual user ID from auth
        title,
        prompt,
        style: style as string,
        code,
      },
    })

    return NextResponse.json({
      id: template.id,
      title: template.title,
      code: template.code,
      style: template.style,
      createdAt: template.createdAt,
    })
  } catch (error) {
    console.error('Error in generate-template API:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate template',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

