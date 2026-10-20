import { NextResponse } from "next/server";

// The template-finder chat ran on a metered DeepInfra model. It is switched off (20 Oct 2026) so the
// site makes no paid LLM calls; the previous DeepInfra version is in git history if it comes back.
export async function POST() {
	return NextResponse.json(
		{ reply: "Browse templates directly at /templates to find the right fit for your business." },
		{ status: 410 }
	);
}
