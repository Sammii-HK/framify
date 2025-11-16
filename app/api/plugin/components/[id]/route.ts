import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { corsHeaders, handleCORS } from '@/lib/cors'

/**
 * Plugin-specific endpoint that returns component WITH code
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

    const component = await prisma.component.findFirst({
      where: {
        id,
        isPublic: true, // Only return public components
      },
      select: {
        id: true,
        name: true,
        description: true,
        code: true, // Include code for plugin
        componentType: true,
        category: true,
        tags: true,
        createdAt: true,
      },
    })

    if (!component) {
      return NextResponse.json(
        { error: 'Component not found or not public' },
        {
          status: 404,
          headers: corsHeaders(origin),
        }
      )
    }

    // Increment view count (async)
    prisma.component
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(console.error)

    return NextResponse.json(
      {
        id: component.id,
        name: component.name,
        title: component.name, // Alias for consistency
        description: component.description,
        code: component.code,
        componentType: component.componentType,
        category: component.category,
        tags: component.tags || [],
        createdAt: component.createdAt.toISOString(),
      },
      {
        headers: corsHeaders(origin),
      }
    )
  } catch (error) {
    console.error('Error fetching component code:', error)
    const origin = req.headers.get('origin')
    return NextResponse.json(
      {
        error: 'Failed to fetch component code',
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

