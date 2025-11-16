import { NextResponse } from "next/server";

/**
 * CORS configuration for public API endpoints
 * Only allow specific origins for security
 */

const ALLOWED_ORIGINS = [
	"https://framify-nine.vercel.app",
	"http://localhost:3000",
	"https://studio.sammii.dev",
	"https://framer.com",
	"https://*.framer.com",
	// Add your studio store domains here
	// 'https://your-studio-store.com',
];

export function corsHeaders(origin: string | null) {
	// Check if origin matches allowed origins (including wildcard patterns)
	let allowedOrigin = ALLOWED_ORIGINS[0]; // Default to your own domain
	
	if (origin) {
		// Check exact match
		if (ALLOWED_ORIGINS.includes(origin)) {
			allowedOrigin = origin;
		} else {
			// Check wildcard patterns
			for (const pattern of ALLOWED_ORIGINS) {
				if (pattern.includes('*')) {
					const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
					if (regex.test(origin)) {
						allowedOrigin = origin;
						break;
					}
				}
			}
		}
	}

	return {
		"Access-Control-Allow-Origin": allowedOrigin,
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Access-Control-Max-Age": "86400", // 24 hours
	};
}

export function handleCORS(request: Request) {
	const origin = request.headers.get("origin");

	// Handle preflight requests
	if (request.method === "OPTIONS") {
		return new NextResponse(null, {
			status: 200,
			headers: corsHeaders(origin),
		});
	}

	return null;
}
