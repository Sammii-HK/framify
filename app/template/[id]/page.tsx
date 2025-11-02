import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TemplateViewer from '@/components/TemplateViewer'

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

export async function generateMetadata({ params }: TemplatePageProps) {
  try {
    const { id } = await params
    const template = await prisma.template.findUnique({
      where: { id },
      select: { title: true },
    })

    return {
      title: template ? `${template.title} - Framify` : 'Template - Framify',
    }
  } catch {
    return {
      title: 'Template - Framify',
    }
  }
}

