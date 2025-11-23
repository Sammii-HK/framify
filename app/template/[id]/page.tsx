import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TemplateViewer from '@/components/TemplateViewer'
import { generatePageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

interface TemplatePageProps {
  params: Promise<{ id: string }>
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { id } = await params

  try {
    const template = await prisma.template.findUnique({
      where: { id },
    })

    if (!template) {
      notFound()
    }

    return <TemplateViewer template={template} />
  } catch (error) {
    console.error('Error fetching template:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const template = await prisma.template.findUnique({
      where: { id },
      select: { 
        title: true,
        description: true,
        tags: true,
        category: true,
      },
    })

    if (!template) {
      return generatePageMetadata({
        title: 'Astrology Template',
        description: 'Explore astrology and horoscope templates on Lunary',
        path: `/template/${id}`,
      })
    }

    return generatePageMetadata({
      title: template.title,
      description: template.description || `Discover ${template.title} - astrology template with ${template.tags?.join(', ') || 'mystical'} features on Lunary`,
      keywords: [
        ...(template.tags || []),
        template.category || '',
        'astrology template',
        'horoscope template',
      ].filter(Boolean),
      path: `/template/${id}`,
    })
  } catch {
    return generatePageMetadata({
      title: 'Astrology Template',
      description: 'Explore astrology and horoscope templates on Lunary',
      path: `/template/${id}`,
    })
  }
}

