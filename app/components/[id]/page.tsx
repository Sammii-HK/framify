import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ComponentViewer from '@/components/ComponentViewer'

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

export async function generateMetadata({ params }: ComponentPageProps) {
  try {
    const { id } = await params
    const component = await prisma.component.findUnique({
      where: { id },
      select: { name: true },
    })

    return {
      title: component ? `${component.name} - Framify Components` : 'Component - Framify',
    }
  } catch {
    return {
      title: 'Component - Framify',
    }
  }
}

