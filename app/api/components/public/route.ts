import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { corsHeaders, handleCORS } from "@/lib/cors";

/**
 * Public API endpoint for components
 * Returns components formatted for external consumption (no code)
 *
 * Usage: GET /api/components/public?category=Button&limit=10
 */
export async function GET(req: NextRequest) {
	// Handle CORS preflight
	const corsResponse = handleCORS(req);
	if (corsResponse) return corsResponse;

	try {
		const { searchParams } = new URL(req.url);
		const category = searchParams.get("category") || "";
		const componentType = searchParams.get("componentType") || "";
		const limit = parseInt(searchParams.get("limit") || "20");
		const offset = parseInt(searchParams.get("offset") || "0");
		const featured = searchParams.get("featured") === "true";

		// Build where clause - only public components
		const where: {
			isPublic: boolean;
			category?: string;
			componentType?: string;
			featured?: boolean;
		} = {
			isPublic: true,
		};

		if (category) {
			where.category = category;
		}

		if (componentType) {
			where.componentType = componentType;
		}

		if (featured) {
			where.featured = true;
		}

		const [components, total] = await Promise.all([
			prisma.component.findMany({
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
					name: true,
					description: true,
					componentType: true,
					category: true,
					tags: true,
					price: true,
					licenseType: true,
					thumbnailUrl: true,
					framerUrl: true,
					previewUrl: true,
					viewCount: true,
					downloadCount: true,
					salesCount: true,
					featured: true,
					createdAt: true,
					// Don't expose code via public API
				},
			}),
			prisma.component.count({ where }),
		]);

		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

		const origin = req.headers.get("origin");
		return NextResponse.json(
			{
				components: components.map((component) => ({
					id: component.id,
					name: component.name,
					title: component.name, // Alias for consistency
					description: component.description,
					componentType: component.componentType,
					category: component.category,
					tags: component.tags || [],
					price: component.price || 0,
					licenseType: component.licenseType || "personal",
					thumbnailUrl: component.thumbnailUrl,
					previewUrl: component.previewUrl || component.framerUrl,
					viewUrl: `${baseUrl}/component/${component.id}`,
					stats: {
						views: component.viewCount,
						downloads: component.downloadCount,
						sales: component.salesCount,
					},
					featured: component.featured,
					createdAt: component.createdAt.toISOString(),
				})),
				pagination: {
					total,
					limit,
					offset,
					hasMore: offset + limit < total,
				},
			},
			{
				headers: corsHeaders(origin),
			}
		);
	} catch (error) {
		console.error("Error fetching public components:", error);
		const origin = req.headers.get("origin");
		return NextResponse.json(
			{
				error: "Failed to fetch components",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{
				status: 500,
				headers: corsHeaders(origin),
			}
		);
	}
}

// Handle OPTIONS preflight requests
export async function OPTIONS(req: NextRequest) {
	const corsResponse = handleCORS(req);
	return corsResponse || new NextResponse(null, { status: 200 });
}

