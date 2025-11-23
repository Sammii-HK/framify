import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lunary.app";

	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/grimoire`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/marketplace`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/dashboard`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.7,
		},
	];

	// Dynamic template pages
	let templatePages: MetadataRoute.Sitemap = [];
	try {
		const templates = await prisma.template.findMany({
			where: { isPublic: true },
			select: {
				id: true,
				updatedAt: true,
			},
			take: 1000, // Limit to prevent sitemap from being too large
		});

		templatePages = templates.map((template) => ({
			url: `${baseUrl}/template/${template.id}`,
			lastModified: template.updatedAt,
			changeFrequency: "weekly" as const,
			priority: 0.6,
		}));
	} catch (error) {
		console.error("Error fetching templates for sitemap:", error);
	}

	// Dynamic component pages
	let componentPages: MetadataRoute.Sitemap = [];
	try {
		const components = await prisma.component.findMany({
			where: { isPublic: true },
			select: {
				id: true,
				updatedAt: true,
			},
			take: 1000,
		});

		componentPages = components.map((component) => ({
			url: `${baseUrl}/components/${component.id}`,
			lastModified: component.updatedAt,
			changeFrequency: "weekly" as const,
			priority: 0.5,
		}));
	} catch (error) {
		console.error("Error fetching components for sitemap:", error);
	}

	// Tarot card pages (all 78 cards)
	const tarotCardPages: MetadataRoute.Sitemap = [
		// Major Arcana
		...["the-fool", "the-magician", "the-high-priestess", "the-empress", "the-emperor", 
			"the-hierophant", "the-lovers", "the-chariot", "strength", "the-hermit",
			"wheel-of-fortune", "justice", "the-hanged-man", "death", "temperance",
			"the-devil", "the-tower", "the-star", "the-moon", "the-sun", "judgement", "the-world"]
			.map((card) => ({
				url: `${baseUrl}/grimoire/tarot/${card}`,
				lastModified: new Date(),
				changeFrequency: "monthly" as const,
				priority: 0.7,
			})),
		// Minor Arcana - Wands
		...["ace-of-wands", "two-of-wands", "three-of-wands", "four-of-wands", "five-of-wands",
			"six-of-wands", "seven-of-wands", "eight-of-wands", "nine-of-wands", "ten-of-wands",
			"page-of-wands", "knight-of-wands", "queen-of-wands", "king-of-wands"]
			.map((card) => ({
				url: `${baseUrl}/grimoire/tarot/${card}`,
				lastModified: new Date(),
				changeFrequency: "monthly" as const,
				priority: 0.7,
			})),
		// Minor Arcana - Cups
		...["ace-of-cups", "two-of-cups", "three-of-cups", "four-of-cups", "five-of-cups",
			"six-of-cups", "seven-of-cups", "eight-of-cups", "nine-of-cups", "ten-of-cups",
			"page-of-cups", "knight-of-cups", "queen-of-cups", "king-of-cups"]
			.map((card) => ({
				url: `${baseUrl}/grimoire/tarot/${card}`,
				lastModified: new Date(),
				changeFrequency: "monthly" as const,
				priority: 0.7,
			})),
		// Minor Arcana - Swords
		...["ace-of-swords", "two-of-swords", "three-of-swords", "four-of-swords", "five-of-swords",
			"six-of-swords", "seven-of-swords", "eight-of-swords", "nine-of-swords", "ten-of-swords",
			"page-of-swords", "knight-of-swords", "queen-of-swords", "king-of-swords"]
			.map((card) => ({
				url: `${baseUrl}/grimoire/tarot/${card}`,
				lastModified: new Date(),
				changeFrequency: "monthly" as const,
				priority: 0.7,
			})),
		// Minor Arcana - Pentacles
		...["ace-of-pentacles", "two-of-pentacles", "three-of-pentacles", "four-of-pentacles", "five-of-pentacles",
			"six-of-pentacles", "seven-of-pentacles", "eight-of-pentacles", "nine-of-pentacles", "ten-of-pentacles",
			"page-of-pentacles", "knight-of-pentacles", "queen-of-pentacles", "king-of-pentacles"]
			.map((card) => ({
				url: `${baseUrl}/grimoire/tarot/${card}`,
				lastModified: new Date(),
				changeFrequency: "monthly" as const,
				priority: 0.7,
			})),
	];

	// Zodiac sign pages (all 12 signs)
	const zodiacSignPages: MetadataRoute.Sitemap = [
		"aries", "taurus", "gemini", "cancer", "leo", "virgo",
		"libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
	].map((sign) => ({
		url: `${baseUrl}/grimoire/zodiac/${sign}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.8,
	}));

	return [...staticPages, ...templatePages, ...componentPages, ...tarotCardPages, ...zodiacSignPages];
}
