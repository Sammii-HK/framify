import { NextRequest, NextResponse } from 'next/server'
import { generateTemplateCode, type Style } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

/**
 * Generate a style variation of an existing template
 * Takes the original prompt and creates a new version in a different style
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { templateId, newStyle } = body

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    if (!newStyle || !['Minimal', 'Bold', 'Soft', 'Dark'].includes(newStyle)) {
      return NextResponse.json(
        { error: 'Valid style is required (Minimal, Bold, Soft, or Dark)' },
        { status: 400 }
      )
    }

    // Get the original template
    const originalTemplate = await prisma.template.findUnique({
      where: { id: templateId },
    })

    if (!originalTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Generate new template with same prompt but different style
    // Add context that this is a style variation
    const variationPrompt = `${originalTemplate.prompt} - Create a variation in ${newStyle} style, inspired by real design systems but original. Keep the same core concept and functionality but apply the ${newStyle} aesthetic authentically.`

    const { code, title } = await generateTemplateCode(
      variationPrompt,
      newStyle as Style
    )

    // Save the variation to database
    const variation = await prisma.template.create({
      data: {
        userId: originalTemplate.userId,
        title: `${originalTemplate.title} (${newStyle})`,
        prompt: originalTemplate.prompt, // Keep original prompt
        style: newStyle,
        code,
      },
    })

    return NextResponse.json({
      id: variation.id,
      title: variation.title,
      code: variation.code,
      style: variation.style,
      createdAt: variation.createdAt,
    })
  } catch (error) {
    console.error('Error in generate-variation API:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate style variation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

