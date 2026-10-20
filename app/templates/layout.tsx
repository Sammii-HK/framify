import type { Metadata } from 'next'
import { templates } from '@/lib/template-data'

export const metadata: Metadata = {
  title: 'Website Templates for Local Businesses',
  description: `Browse ${templates.length} website templates for therapists, cleaners, app makers, tradespeople, salons, restaurants and more. Buy once and download clean HTML, or deploy to your own address in one click.`,
  alternates: {
    canonical: 'https://craftmypage.com/templates',
  },
  openGraph: {
    title: 'Website Templates for Local Businesses | CraftMyPage',
    description: `Browse ${templates.length} website templates for therapists, cleaners, app makers, tradespeople, salons and more. Buy once and download clean HTML, or deploy in one click.`,
    url: 'https://craftmypage.com/templates',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'CraftMyPage Website Templates' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Templates for Local Businesses | CraftMyPage',
    description: `Browse ${templates.length} website templates for local businesses, practitioners and app makers.`,
    images: ['/opengraph-image'],
  },
}

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children
}
