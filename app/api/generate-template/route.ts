import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { generateTemplateCode, type Style } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

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
		const { prompt, style, baseTemplateId } = body;

		if (!prompt || typeof prompt !== "string") {
			return NextResponse.json(
				{ error: "Prompt is required" },
				{ status: 400 }
			);
		}

		if (!style || !["Minimal", "Bold", "Soft", "Dark"].includes(style)) {
			return NextResponse.json(
				{ error: "Valid style is required (Minimal, Bold, Soft, or Dark)" },
				{ status: 400 }
			);
		}

		// Generate template code using OpenAI
		const { code, title } = await generateTemplateCode(prompt, style as Style);

		// Save to database with real user ID
		const template = await prisma.template.create({
			data: {
				userId: userId,
				title,
				prompt,
				style: style as string,
				code,
				// Auto-set defaults for monetization
				isPublic: false, // User can enable later
				licenseType: "personal",
				viewCount: 0,
				downloadCount: 0,
				salesCount: 0,
				baseTemplateId: baseTemplateId || null,
			},
		});

		// Optional: Auto-publish to Framer if enabled
		const autoPublishToFramer = process.env.AUTO_PUBLISH_TO_FRAMER === "true";
		let framerUrl = null;

		if (autoPublishToFramer) {
			try {
				const { createFramerProject } = await import("@/lib/framer");
				const framerProject = await createFramerProject(title, code);
				framerUrl = framerProject.url;

				// Update template with Framer URL
				await prisma.template.update({
					where: { id: template.id },
					data: { framerUrl },
				});
			} catch (error) {
				// Log but don't fail - template was created successfully
				console.warn("Auto-publish to Framer failed:", error);
			}
		}

		return NextResponse.json({
			id: template.id,
			title: template.title,
			code: template.code,
			style: template.style,
			framerUrl,
			createdAt: template.createdAt,
		});
	} catch (error) {
		console.error("Error in generate-template API:", error);
		return NextResponse.json(
			{
				error: "Failed to generate template",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
