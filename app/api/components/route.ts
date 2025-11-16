import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

/**
 * GET: List components for authenticated user
 * POST: Create a new component
 */
export async function GET(req: NextRequest) {
	try {
		// Get user session
		const session = await auth0.getSession();
		if (!session?.user) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}

		const userId = session.user.sub; // Auth0 user ID

		const { searchParams } = new URL(req.url);
		const search = searchParams.get("search") || "";
		const category = searchParams.get("category") || "";
		const componentType = searchParams.get("componentType") || "";

		// Build where clause - only get components for logged-in user
		const where: {
			userId: string;
			name?: { contains: string; mode?: "insensitive" };
			category?: string;
			componentType?: string;
		} = {
			userId,
		};

		if (search) {
			where.name = {
				contains: search,
				mode: "insensitive",
			};
		}

		if (category) {
			where.category = category;
		}

		if (componentType) {
			where.componentType = componentType;
		}

		const components = await prisma.component.findMany({
			where,
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				name: true,
				description: true,
				componentType: true,
				category: true,
				isPublic: true,
				framerUrl: true,
				createdAt: true,
			},
		});

		return NextResponse.json({ components });
	} catch (error) {
		console.error("Error fetching components:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch components",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		// Get user session
		const session = await auth0.getSession();
		if (!session?.user) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}

		const userId = session.user.sub; // Auth0 user ID

		const body = await req.json();
		const {
			name,
			code,
			description,
			componentType,
			category,
			tags,
			templateId,
		} = body;

		if (!name || !code || !componentType) {
			return NextResponse.json(
				{
					error: "Name, code, and componentType are required",
				},
				{ status: 400 }
			);
		}

		const component = await prisma.component.create({
			data: {
				userId,
				name,
				code,
				description,
				componentType,
				category,
				tags: tags || [],
				templateId: templateId || null,
			},
		});

		return NextResponse.json({ component }, { status: 201 });
	} catch (error) {
		console.error("Error creating component:", error);
		return NextResponse.json(
			{
				error: "Failed to create component",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
