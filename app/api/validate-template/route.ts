import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { validateTemplate, saveScreenshots } from '@/lib/template-validator'

/**
 * POST /api/validate-template
 * Render a template in a real browser and return validation results + screenshots.
 * Use this before publishing to marketplace.
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

    const { templateId } = await req.json()

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId is required' },
        { status: 400 }
      )
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Run rendering validation
    const validation = await validateTemplate(template.code)

    // Save screenshots if validation passed
    let screenshotPaths: Record<string, string> = {}
    if (validation.passed) {
      screenshotPaths = await saveScreenshots(
        templateId,
        validation.screenshots
      )
    }

    return NextResponse.json({
      templateId,
      passed: validation.passed,
      errors: validation.errors,
      warnings: validation.warnings,
      metrics: validation.metrics,
      screenshots: Object.keys(screenshotPaths).length > 0
        ? screenshotPaths
        : undefined,
    })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
