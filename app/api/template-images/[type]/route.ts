import { NextResponse } from 'next/server'
import { templates } from '@/lib/template-data'
import { getTemplatePreviewImages, triggerDownload } from '@/lib/stock-images'

// Cache for 24 hours — template preview images rarely change
export const revalidate = 86400

const validTypes = new Set(templates.map((t) => t.type))

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params

  if (!validTypes.has(type)) {
    return NextResponse.json(
      { error: `Invalid template type: ${type}` },
      { status: 404 },
    )
  }

  const images = await getTemplatePreviewImages(type)

  // Fire-and-forget download tracking for each photo (required by Unsplash guidelines)
  for (const image of images) {
    triggerDownload(image.downloadEndpoint)
  }

  return NextResponse.json(images, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  })
}
