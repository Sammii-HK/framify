import { generatePageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
	title: 'Astrology Templates Marketplace',
	description: 'Browse and discover astrology templates, horoscope designs, tarot card layouts, and mystical website templates. Find the perfect astrology template for your spiritual business or personal project.',
	keywords: [
		'astrology templates',
		'horoscope templates',
		'tarot card templates',
		'zodiac templates',
		'astrology website templates',
		'spiritual templates',
	],
	path: '/marketplace',
})

export default function MarketplaceLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}
