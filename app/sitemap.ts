import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://craftmypage.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/generate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/templates`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Dynamic template pages
  try {
    const templates = await prisma.template.findMany({
      select: { id: true, updatedAt: true },
      where: { isPublic: true },
    })

    const templatePages: MetadataRoute.Sitemap = templates.map((t) => ({
      url: `${base}/template/${t.id}`,
      lastModified: t.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...staticPages, ...templatePages]
  } catch {
    return staticPages
  }
}
