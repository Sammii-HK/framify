import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lunar.app";
const siteName = "Lunar - Astrology & Horoscopes";

/**
 * Generate comprehensive SEO metadata for pages
 */
export function generatePageMetadata({
	title,
	description,
	keywords = [],
	path = "/",
	image,
	noindex = false,
}: {
	title: string;
	description: string;
	keywords?: string[];
	path?: string;
	image?: string;
	noindex?: boolean;
}): Metadata {
	const fullTitle = title.includes("Lunar") ? title : `${title} | ${siteName}`;
	const url = `${siteUrl}${path}`;
	const defaultImage = image || `${siteUrl}/og-image.jpg`;

	const baseKeywords = [
		"astrology",
		"horoscopes",
		"daily horoscope",
		"tarot cards",
		"tarot reading",
		"zodiac signs",
		"birth chart",
		"astrology reading",
		"spiritual guidance",
	];

	return {
		title: fullTitle,
		description,
		keywords: [...baseKeywords, ...keywords],
		alternates: {
			canonical: url,
		},
		openGraph: {
			title: fullTitle,
			description,
			url,
			siteName,
			images: [
				{
					url: defaultImage,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
			locale: "en_US",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description,
			images: [defaultImage],
		},
		robots: noindex
			? {
					index: false,
					follow: false,
				}
			: {
					index: true,
					follow: true,
					googleBot: {
						index: true,
						follow: true,
						"max-video-preview": -1,
						"max-image-preview": "large",
						"max-snippet": -1,
					},
				},
	};
}

/**
 * Generate structured data (JSON-LD) for better SEO
 */
export function generateStructuredData({
	type,
	data,
}: {
	type: "WebSite" | "WebPage" | "Article" | "BreadcrumbList" | "FAQPage" | "ItemList";
	data: Record<string, any>;
}): object {
	const baseStructure = {
		"@context": "https://schema.org",
		"@type": type,
	};

	return {
		...baseStructure,
		...data,
	};
}

/**
 * Generate website structured data
 */
export function getWebsiteStructuredData() {
	return generateStructuredData({
		type: "WebSite",
		data: {
			name: siteName,
			url: siteUrl,
			description:
				"Your complete guide to astrology, horoscopes, tarot cards, zodiac signs, and spiritual wisdom.",
			potentialAction: {
				"@type": "SearchAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate: `${siteUrl}/search?q={search_term_string}`,
				},
				"query-input": "required name=search_term_string",
			},
		},
	});
}

/**
 * Generate breadcrumb structured data
 */
export function getBreadcrumbStructuredData(items: { name: string; url: string }[]) {
	return generateStructuredData({
		type: "BreadcrumbList",
		data: {
			itemListElement: items.map((item, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: item.name,
				item: item.url,
			})),
		},
	});
}
