import { NextResponse } from "next/server";

/**
 * CORS configuration for public API endpoints
 * Only allow specific origins for security
 */

const ALLOWED_ORIGINS = [
	"https://framify-nine.vercel.app",
	"http://localhost:3000",
	"https://studio.sammii.dev",
	// Add your studio store domains here
	// 'https://your-studio-store.com',
];

export function corsHeaders(origin: string | null) {
	const allowedOrigin =
		origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]; // Default to your own domain

	return {
		"Access-Control-Allow-Origin": allowedOrigin,
		"Access-Control-Allow-Methods": "GET, OPTIONS",
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
