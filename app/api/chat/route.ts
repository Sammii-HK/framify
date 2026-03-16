import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are CraftMyPage's assistant, helping visitors find the right website template for their business.

Your job:
1. Ask about their business type, what services they offer, and their location (one or two questions at a time, not all at once).
2. Based on their answers, recommend one of these template types: standard, trades, salon, restaurant, portfolio, consultant.
3. Suggest a colour palette that suits their industry (e.g. "earth" for landscapers, "ocean" for spas, "bold" for gyms, "warm" for restaurants, "minimal" for consultants, "vibrant" for salons).
4. Once you have enough info, provide a direct link like: /generate?template=trades&palette=earth
5. Keep every response to 2-3 sentences max. Be friendly but professional.
6. Do not use emojis.`;

const client = new OpenAI({
	baseURL: "https://api.deepinfra.com/v1/openai",
	apiKey: process.env.DEEPINFRA_API_KEY,
});

export async function POST(req: NextRequest) {
	try {
		const { message, history } = await req.json();

		if (!message || typeof message !== "string") {
			return NextResponse.json(
				{ reply: "Could not understand your message. Please try again." },
				{ status: 400 }
			);
		}

		const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
			{ role: "system", content: SYSTEM_PROMPT },
			...(history || [])
				.filter((m: { role: string; content: string }) =>
					["user", "assistant"].includes(m.role)
				)
				.map((m: { role: string; content: string }) => ({
					role: m.role as "user" | "assistant",
					content: m.content,
				})),
		];

		// Ensure the latest user message is included (in case history doesn't have it yet)
		const lastMsg = messages[messages.length - 1];
		if (lastMsg?.role !== "user" || lastMsg?.content !== message) {
			messages.push({ role: "user", content: message });
		}

		const completion = await client.chat.completions.create({
			model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
			messages,
			max_tokens: 200,
			temperature: 0.7,
		});

		const reply =
			completion.choices[0]?.message?.content?.trim() ||
			"I'm not sure how to help with that. Try visiting /generate to browse templates directly.";

		return NextResponse.json({ reply });
	} catch (error) {
		console.error("Chat API error:", error);
		return NextResponse.json({
			reply: "Sorry, I'm having trouble right now. You can browse templates directly at /generate to find the right fit for your business.",
		});
	}
}
