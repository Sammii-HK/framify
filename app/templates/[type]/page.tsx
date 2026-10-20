import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { templates, getTemplate, getTemplateDetail } from '@/lib/template-data'
import TemplateDetailClient from './TemplateDetailClient'

const BASE = 'https://craftmypage.com'

export function generateStaticParams() {
  return templates.map((t) => ({ type: t.type }))
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params
  const template = getTemplate(type)
  if (!template) return { title: 'Template not found', robots: { index: false } }

  const detail = getTemplateDetail(type)
  const title = detail.seoTitle || `${template.name} Website Template for ${template.bestFor.split(',')[0]}`
  const description =
    detail.seoDescription ||
    `${template.description} Best for ${template.bestFor.toLowerCase()}. Deploy it on CraftMyPage in minutes${template.price ? ` or download the HTML for £${template.price}` : ''}.`
  const url = `${BASE}/templates/${type}`
  const image = template.preview?.og || `/api/template/${type}/preview`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | CraftMyPage`,
      description,
      url,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: `${template.name} website template` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

/** Serialise JSON-LD safely: escaping "<" stops any value closing the script tag. */
function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export default async function TemplatePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const template = getTemplate(type)
  if (!template) notFound()

  const detail = getTemplateDetail(type)
  const url = `${BASE}/templates/${type}`
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${template.productName || template.name} website template`,
      description: detail.longDescription,
      url,
      image: template.preview ? `${BASE}${template.preview.og}` : `${BASE}/api/template/${type}/preview`,
      brand: { '@type': 'Brand', name: 'CraftMyPage' },
      category: 'Website templates',
      ...(template.price
        ? {
            offers: {
              '@type': 'Offer',
              price: template.price.toFixed(2),
              priceCurrency: 'GBP',
              availability: 'https://schema.org/InStock',
              url,
            },
          }
        : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Templates', item: `${BASE}/templates` },
        { '@type': 'ListItem', position: 2, name: template.name, item: url },
      ],
    },
  ]

  return (
    <>
      {/* JSON-LD built from static template data (no user input), "<" escaped */}
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <TemplateDetailClient type={type} />
    </>
  )
}
