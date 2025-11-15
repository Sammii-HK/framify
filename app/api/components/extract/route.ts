import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import {
  extractComponent,
  detectComponents,
  type ComponentType,
} from '@/lib/component-extractor'

/**
 * POST /api/components/extract
 * Extract component from template code
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const body = await req.json()
    const {
      templateId,
      componentName,
      code,
      startLine,
      endLine,
      style,
      category,
    } = body

    if (!code || !componentName) {
      return NextResponse.json(
        { error: 'Code and componentName are required' },
        { status: 400 }
      )
    }

    // Get template if templateId provided
    let template = null
    if (templateId) {
      template = await prisma.template.findUnique({
        where: { id: templateId },
      })

      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }

      if (template.userId !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }
    }

    // Extract component with metadata
    const extracted = await extractComponent(
      code,
      componentName,
      style || template?.style || 'Minimal Corporate',
      category || template?.category || undefined,
      startLine,
      endLine
    )

    // Create component in database
    const component = await prisma.component.create({
      data: {
        userId,
        name: extracted.name,
        code: extracted.code,
        description: extracted.description,
        componentType: extracted.componentType,
        price: extracted.price,
        templateId: templateId || null,
        tags: extracted.tags,
        category: category || template?.category || null,
        licenseType: 'personal',
        isPublic: false,
        marketplaceReady: true,
      },
    })

    return NextResponse.json({
      component,
      extracted,
    })
  } catch (error) {
    console.error('Error extracting component:', error)
    return NextResponse.json(
      {
        error: 'Failed to extract component',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/components/extract?templateId=xxx
 * Auto-detect components in template
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const templateId = searchParams.get('templateId')

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId is required' },
        { status: 400 }
      )
    }

    const userId = session.user.sub

    // Get template
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    if (template.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Detect components
    const detected = detectComponents(template.code)

    return NextResponse.json({
      components: detected,
      template: {
        id: template.id,
        title: template.title,
        style: template.style,
      },
    })
  } catch (error) {
    console.error('Error detecting components:', error)
    return NextResponse.json(
      { error: 'Failed to detect components' },
      { status: 500 }
    )
  }
}

