import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Template Marketplace',
  description: 'Browse professional website templates for local businesses — salons, restaurants, tradespeople, and more. Pick a design and go live in minutes.',
  openGraph: {
    title: 'Template Marketplace — CraftMyPage',
    description: 'Browse professional website templates for local businesses. Pick a design and go live in minutes.',
    url: 'https://craftmypage.com/marketplace',
  },
}

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children
}
