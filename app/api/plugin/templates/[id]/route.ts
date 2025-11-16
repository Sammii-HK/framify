import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { corsHeaders, handleCORS } from '@/lib/cors'

/**
 * Plugin-specific endpoint that returns template WITH code
 * This endpoint is only for Framer plugin use
 * 
 * Authentication: Origin-based (from Framer plugin)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Handle CORS preflight
  const corsResponse = handleCORS(req)
  if (corsResponse) return corsResponse

  try {
    const { id } = await params
    const origin = req.headers.get('origin')

    // Verify origin is from Framer plugin (optional but recommended)
    // For now, we'll allow any origin that matches our CORS config
    // You can add stricter validation if needed

    const template = await prisma.template.findFirst({
      where: {
        id,
        isPublic: true, // Only return public templates
      },
      select: {
        id: true,
        title: true,
        description: true,
        code: true, // Include code for plugin
        style: true,
        category: true,
        tags: true,
        createdAt: true,
      },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or not public' },
        {
          status: 404,
          headers: corsHeaders(origin),
        }
      )
    }

    // Increment view count (async)
    prisma.template
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(console.error)

    return NextResponse.json(
      {
        id: template.id,
        title: template.title,
        description: template.description,
        code: template.code,
        style: template.style,
        category: template.category,
        tags: template.tags || [],
        createdAt: template.createdAt.toISOString(),
      },
      {
        headers: corsHeaders(origin),
      }
    )
  } catch (error) {
    console.error('Error fetching template code:', error)
    const origin = req.headers.get('origin')
    return NextResponse.json(
      {
        error: 'Failed to fetch template code',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: corsHeaders(origin),
      }
    )
  }
}

// Handle OPTIONS preflight requests
export async function OPTIONS(req: NextRequest) {
  const corsResponse = handleCORS(req)
  return corsResponse || new NextResponse(null, { status: 200 })
}

