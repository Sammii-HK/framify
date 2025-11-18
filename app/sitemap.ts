import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lunar.app";

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

	return [...staticPages, ...templatePages, ...componentPages];
}
