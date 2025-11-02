import { NextRequest, NextResponse } from 'next/server'
import { createFramerProject } from '@/lib/framer'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, code, templateId } = body

    if (!title || !code) {
      return NextResponse.json(
        { error: 'Title and code are required' },
        { status: 400 }
      )
    }

    // Create Framer project
    const project = await createFramerProject(title, code)

    // Update template in database with Framer URL if templateId is provided
    if (templateId) {
      try {
        await prisma.template.update({
          where: { id: templateId },
          data: {
            framerUrl: project.url,
          },
        })
      } catch (dbError) {
        // Log but don't fail - Framer project was created successfully
        console.warn('Failed to update template with Framer URL:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        url: project.url,
        name: project.name,
      },
      message: 'Template successfully exported to Framer!',
    })
  } catch (error) {
    console.error('Error in framer-upload API:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Provide helpful error messages
    if (errorMessage.includes('FRAMER_ACCESS_TOKEN') || errorMessage.includes('FRAMER_CLIENT_ID')) {
      return NextResponse.json(
        {
          error: 'Framer authentication not configured',
          details: 'Please add FRAMER_ACCESS_TOKEN (or FRAMER_CLIENT_ID and FRAMER_CLIENT_SECRET) to your .env.local file',
        },
        { status: 500 }
      )
    }

    if (errorMessage.includes('FRAMER_PROJECT_ID')) {
      return NextResponse.json(
        {
          error: 'Framer project ID not configured',
          details: 'Please create a Framer project and add FRAMER_PROJECT_ID to your .env.local file',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to upload to Framer',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

