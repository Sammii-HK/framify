import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { templates as galleryTemplates } from '@/lib/template-data'
import { guides } from '@/lib/guides'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://craftmypage.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/templates`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...guides.map((g) => ({ url: `${base}/guides/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: 'monthly' as const, priority: 0.7 })),
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Gallery template detail pages (the pages people search for, e.g. "therapist website template").
  // /generate is noindex, so it stays out of the sitemap.
  const galleryPages: MetadataRoute.Sitemap = galleryTemplates.map((t) => ({
    url: `${base}/templates/${t.type}`,
    changeFrequency: 'monthly',
    priority: t.kit ? 0.8 : 0.6,
    ...(t.preview ? { images: [`${base}${t.preview.og}`] } : {}),
  }))

  // Dynamic template pages
  try {
    const templates = await prisma.template.findMany({
      select: { id: true },
      where: { isPublic: true },
    })

    const templatePages: MetadataRoute.Sitemap = templates.map((t) => ({
      url: `${base}/template/${t.id}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...staticPages, ...galleryPages, ...templatePages]
  } catch {
    return [...staticPages, ...galleryPages]
  }
}
