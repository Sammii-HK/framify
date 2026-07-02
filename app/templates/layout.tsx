import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Website Templates for Local Businesses',
  description: 'Browse 21 ready-made website templates for tradespeople, salons, restaurants, and more. Buy once, download clean HTML, or deploy to your own craftmypage.com address in one click.',
  alternates: {
    canonical: 'https://craftmypage.com/templates',
  },
  openGraph: {
    title: 'Website Templates for Local Businesses | CraftMyPage',
    description: 'Browse 21 ready-made website templates for tradespeople, salons, restaurants, and more. Buy once, download clean HTML, or deploy in one click.',
    url: 'https://craftmypage.com/templates',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'CraftMyPage Website Templates' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Templates for Local Businesses | CraftMyPage',
    description: 'Browse 21 ready-made website templates for tradespeople, salons, restaurants, and more.',
    images: ['/opengraph-image'],
  },
}

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children
}
