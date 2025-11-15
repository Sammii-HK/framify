import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { generateTemplateCode, type Style, extractMetadata } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { validateTemplateQuality, validateRuntimeSafety } from "@/lib/template-quality";
import { suggestPricing } from "@/lib/pricing";

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

		const validStyles = [
			"Minimal Corporate",
			"Dark Tech / SaaS",
			"E-commerce Product Showcase",
			"Creative Portfolio / Designer",
			"Agency / Studio Bold",
			"Grid / Magazine Editorial",
			"Luxury / Premium Brand",
			"Retro / Y2K",
			"Pastel / Playful",
			"Single-Page App / Startup Landing"
		];
		
		if (!style || !validStyles.includes(style)) {
			return NextResponse.json(
				{ error: `Valid style is required. Available styles: ${validStyles.join(", ")}` },
				{ status: 400 }
			);
		}

		// Generate template code using OpenAI (with aggressive retry logic for quality)
		let code: string
		let title: string
		let qualityCheck: ReturnType<typeof validateTemplateQuality>
		let attempts = 0
		const maxAttempts = 5 // Increased attempts
		const minAcceptableScore = 80 // Higher threshold

		do {
			const result = await generateTemplateCode(prompt, style as Style);
			code = result.code
			title = result.title

			// Validate template quality
			qualityCheck = validateTemplateQuality(code);
			attempts++

			// Check for critical failures
			const hasCriticalIssues = 
				!qualityCheck.hasResponsiveDesign || 
				!qualityCheck.hasTypographyHierarchy ||
				qualityCheck.issues.some(issue => issue.includes('undefined') || issue.includes('Potential undefined'))

			// If quality is acceptable AND no critical issues, break
			if (qualityCheck.score >= minAcceptableScore && !hasCriticalIssues) {
				console.log(`✅ Template quality acceptable: ${qualityCheck.score}/100 (attempt ${attempts})`)
				break
			}

			// If max attempts reached, check if we can accept it anyway
			if (attempts >= maxAttempts) {
				// Only accept if score >= 75 AND no critical issues
				if (qualityCheck.score < 75 || hasCriticalIssues) {
					return NextResponse.json(
						{
							error: 'Template quality too low after multiple attempts',
							details: `Quality score: ${qualityCheck.score}/100 after ${maxAttempts} attempts. Template does not meet minimum quality standards.`,
							issues: qualityCheck.issues,
							score: qualityCheck.score,
							attempts: maxAttempts,
							suggestion: 'Please try regenerating with a more detailed prompt, different style, or contact support if this persists.',
						},
						{ status: 422 } // Unprocessable Entity
					)
				}
				break
			}

			console.warn(`⚠️ Template quality score: ${qualityCheck.score}/100. Regenerating... (attempt ${attempts}/${maxAttempts})`)
			if (hasCriticalIssues) {
				console.warn(`⚠️ CRITICAL ISSUES DETECTED - Will retry`)
			}
		} while (attempts < maxAttempts)

		// Final validation - REJECT if still doesn't meet standards
		const runtimeIssues = qualityCheck.issues.filter(issue => 
			issue.includes('undefined') || issue.includes('Potential undefined')
		)
		const hasCriticalIssues = 
			!qualityCheck.hasResponsiveDesign || 
			!qualityCheck.hasTypographyHierarchy ||
			runtimeIssues.length > 0

		// STRICT REJECTION: Score < 75 OR critical issues
		if (qualityCheck.score < 75 || hasCriticalIssues) {
			return NextResponse.json(
				{
					error: 'Template does not meet quality standards',
					details: `Quality score: ${qualityCheck.score}/100. Template has critical issues that prevent it from working properly.`,
					issues: qualityCheck.issues,
					score: qualityCheck.score,
					criticalIssues: {
						missingResponsiveDesign: !qualityCheck.hasResponsiveDesign,
						missingTypographyHierarchy: !qualityCheck.hasTypographyHierarchy,
						runtimeErrors: runtimeIssues.length,
					},
					suggestion: 'Please try regenerating with a more detailed prompt or different style.',
				},
				{ status: 422 } // Unprocessable Entity
			)
		}

		// Log warnings for non-critical issues
		if (qualityCheck.score < 85) {
			console.warn(`⚠️ Template quality score: ${qualityCheck.score}/100`);
			console.warn(`Issues found:`, qualityCheck.issues);
		}

		// Extract metadata for marketplace discoverability
		const metadata = extractMetadata(prompt, style as Style);
		
		// Suggest pricing based on style and complexity
		const pricing = suggestPricing(style as string, metadata.category, metadata.tags);

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
				price: pricing.price, // Auto-suggested pricing
				description: metadata.description,
				category: metadata.category,
				tags: metadata.tags,
				licenseType: "personal",
				viewCount: 0,
				downloadCount: 0,
				salesCount: 0,
				baseTemplateId: baseTemplateId || null,
			},
		});

		// Note: Framer doesn't have a public API, so auto-publish is disabled
		// Users can download .tsx files or copy code to paste into Framer manually
		// See FRAMER_INTEGRATION.md for details
		const framerUrl = null;

		return NextResponse.json({
			id: template.id,
			title: template.title,
			code: template.code,
			style: template.style,
			framerUrl,
			createdAt: template.createdAt,
			qualityScore: qualityCheck.score,
			qualityIssues: qualityCheck.issues.length > 0 ? qualityCheck.issues : undefined,
			qualityPassed: qualityCheck.score >= 75,
			runtimeSafe: runtimeIssues.length === 0,
			pricing: {
				tier: pricing.tier,
				price: pricing.price,
			},
			metadata: {
				category: metadata.category,
				tags: metadata.tags,
				description: metadata.description,
			},
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
