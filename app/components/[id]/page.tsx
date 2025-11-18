import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ComponentViewer from '@/components/ComponentViewer'
import { generatePageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

interface ComponentPageProps {
  params: Promise<{ id: string }>
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { id } = await params

  try {
    const component = await prisma.component.findUnique({
      where: { id },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            style: true,
          },
        },
      },
    })

    if (!component) {
      notFound()
    }

    return <ComponentViewer component={component} />
  } catch (error) {
    console.error('Error fetching component:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: ComponentPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const component = await prisma.component.findUnique({
      where: { id },
      select: { 
        name: true,
        description: true,
        tags: true,
        category: true,
      },
    })

    if (!component) {
      return generatePageMetadata({
        title: 'Astrology Component',
        description: 'Explore astrology and horoscope components on Lunary',
        path: `/components/${id}`,
      })
    }

    return generatePageMetadata({
      title: component.name,
      description: component.description || `Discover ${component.name} - astrology component with ${component.tags?.join(', ') || 'mystical'} features on Lunary`,
      keywords: [
        ...(component.tags || []),
        component.category || '',
        'astrology component',
        'horoscope component',
      ].filter(Boolean),
      path: `/components/${id}`,
    })
  } catch {
    return generatePageMetadata({
      title: 'Astrology Component',
      description: 'Explore astrology and horoscope components on Lunary',
      path: `/components/${id}`,
    })
  }
}

