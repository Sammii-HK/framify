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
      select: { title: true, description: true },
    })

    if (!template) return { title: 'Template — CraftMyPage' }

    const desc = template.description || `Use the ${template.title} template to build a professional website for your business in minutes.`

    return {
      title: template.title,
      description: desc,
      openGraph: {
        title: `${template.title} — CraftMyPage`,
        description: desc,
        url: `https://craftmypage.com/template/${id}`,
      },
      twitter: {
        card: 'summary_large_image' as const,
        title: `${template.title} — CraftMyPage`,
        description: desc,
      },
    }
  } catch {
    return { title: 'Template — CraftMyPage' }
  }
}

