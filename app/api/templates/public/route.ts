import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public API endpoint for studio store integration
 * Returns templates formatted for external consumption
 *
 * Usage: GET /api/templates/public?style=Minimal&limit=10
 */
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const style = searchParams.get("style") || "";
		const category = searchParams.get("category") || "";
		const limit = parseInt(searchParams.get("limit") || "20");
		const offset = parseInt(searchParams.get("offset") || "0");
		const featured = searchParams.get("featured") === "true";

		// Build where clause - only public templates
		const where: {
			isPublic: boolean;
			style?: string;
			category?: string;
			featured?: boolean;
		} = {
			isPublic: true,
		};

		if (style && ["Minimal", "Bold", "Soft", "Dark"].includes(style)) {
			where.style = style;
		}

		if (category) {
			where.category = category;
		}

		if (featured) {
			where.featured = true;
		}

		const [templates, total] = await Promise.all([
			prisma.template.findMany({
				where,
				orderBy: [
					{ featured: "desc" },
					{ viewCount: "desc" },
					{ createdAt: "desc" },
				],
				take: limit,
				skip: offset,
				select: {
					id: true,
					title: true,
					description: true,
					prompt: true,
					style: true,
					category: true,
					tags: true,
					price: true,
					licenseType: true,
					thumbnailUrl: true,
					framerUrl: true,
					viewCount: true,
					downloadCount: true,
					salesCount: true,
					featured: true,
					createdAt: true,
					// Don't expose code via public API - require purchase
				},
			}),
			prisma.template.count({ where }),
		]);

		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

		return NextResponse.json({
			templates: templates.map((template) => ({
				id: template.id,
				title: template.title,
				description: template.description || template.prompt,
				style: template.style,
				category: template.category,
				tags: template.tags || [],
				price: template.price || 0,
				licenseType: template.licenseType || "personal",
				thumbnailUrl: template.thumbnailUrl,
				previewUrl: template.framerUrl, // Framer preview link
				viewUrl: `${baseUrl}/template/${template.id}`,
				stats: {
					views: template.viewCount,
					downloads: template.downloadCount,
					sales: template.salesCount,
				},
				featured: template.featured,
				createdAt: template.createdAt.toISOString(),
			})),
			pagination: {
				total,
				limit,
				offset,
				hasMore: offset + limit < total,
			},
		});
	} catch (error) {
		console.error("Error fetching public templates:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch templates",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
