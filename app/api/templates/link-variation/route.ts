import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Link a template as a variation of a base template
 * Used when generating all styles from one prompt
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { templateId, baseTemplateId } = body

    if (!templateId || !baseTemplateId) {
      return NextResponse.json(
        { error: 'Template ID and base template ID are required' },
        { status: 400 }
      )
    }

    const template = await prisma.template.update({
      where: { id: templateId },
      data: { baseTemplateId },
    })

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        baseTemplateId: template.baseTemplateId,
      },
    })
  } catch (error) {
    console.error('Error linking template variation:', error)
    return NextResponse.json(
      {
        error: 'Failed to link template variation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

