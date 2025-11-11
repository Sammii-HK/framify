import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET: List all prompt templates
 * POST: Create a new prompt template
 */
export async function GET(req: NextRequest) {
  try {
    const prompts = await prisma.promptTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ prompts })
  } catch (error) {
    console.error('Error fetching prompt templates:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch prompt templates',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, prompt, description, category, tags } = body

    if (!name || !prompt) {
      return NextResponse.json(
        { error: 'Name and prompt are required' },
        { status: 400 }
      )
    }

    const promptTemplate = await prisma.promptTemplate.create({
      data: {
        name,
        prompt,
        description: description || null,
        category: category || null,
        tags: tags || [],
      },
    })

    return NextResponse.json({
      id: promptTemplate.id,
      name: promptTemplate.name,
      prompt: promptTemplate.prompt,
      description: promptTemplate.description,
      category: promptTemplate.category,
      tags: promptTemplate.tags,
      createdAt: promptTemplate.createdAt,
    })
  } catch (error) {
    console.error('Error creating prompt template:', error)
    return NextResponse.json(
      {
        error: 'Failed to create prompt template',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

