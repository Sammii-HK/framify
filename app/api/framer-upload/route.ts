import { NextRequest, NextResponse } from 'next/server'
import { createFramerProject } from '@/lib/framer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, code } = body

    if (!title || !code) {
      return NextResponse.json(
        { error: 'Title and code are required' },
        { status: 400 }
      )
    }

    // TODO: Implement actual Framer API integration in Phase 2
    // For now, return a placeholder response
    const project = await createFramerProject(title, code)

    return NextResponse.json({
      message: 'Framer integration coming in Phase 2',
      project,
    })
  } catch (error) {
    console.error('Error in framer-upload API:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload to Framer',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

