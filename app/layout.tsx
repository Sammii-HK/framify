import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import Navigation from "@/components/Navigation";
import { getWebsiteStructuredData } from "@/lib/seo";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Lunar - Your Complete Astrology & Horoscope Guide | Tarot Cards, Zodiac Signs & More",
		template: "%s | Lunar - Astrology & Horoscopes"
	},
	description:
		"Discover comprehensive astrology insights, daily horoscopes, tarot card readings, zodiac sign compatibility, birth chart analysis, and mystical guidance. Lunar is your ultimate source for astrology, horoscopes, tarot cards, and spiritual wisdom.",
	keywords: [
		"astrology",
		"horoscopes",
		"daily horoscope",
		"tarot cards",
		"tarot reading",
		"reversed tarot cards",
		"zodiac signs",
		"birth chart",
		"natal chart",
		"astrology chart",
		"compatibility",
		"zodiac compatibility",
		"moon phases",
		"astrology reading",
		"spiritual guidance",
		"mystical",
		"esoteric",
		"astrology app",
		"horoscope app",
		"tarot app",
		"Aries",
		"Taurus",
		"Gemini",
		"Cancer",
		"Leo",
		"Virgo",
		"Libra",
		"Scorpio",
		"Sagittarius",
		"Capricorn",
		"Aquarius",
		"Pisces"
	],
	authors: [{ name: "Lunar" }],
	creator: "Lunar",
	publisher: "Lunar",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://lunar.app"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: process.env.NEXT_PUBLIC_APP_URL || "https://lunar.app",
		siteName: "Lunar - Astrology & Horoscopes",
		title: "Lunar - Your Complete Astrology & Horoscope Guide",
		description:
			"Discover comprehensive astrology insights, daily horoscopes, tarot card readings, zodiac sign compatibility, birth chart analysis, and mystical guidance.",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Lunar - Astrology & Horoscopes",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Lunar - Your Complete Astrology & Horoscope Guide",
		description:
			"Discover comprehensive astrology insights, daily horoscopes, tarot card readings, zodiac sign compatibility, and mystical guidance.",
		images: ["/og-image.jpg"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		// Add Google Search Console verification when available
		// google: "your-verification-code",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const websiteStructuredData = getWebsiteStructuredData();

	return (
		<html lang="en">
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
				/>
			</head>
			<body className={inter.className}>
				<Auth0Provider>
					<Navigation />
					{children}
				</Auth0Provider>
			</body>
		</html>
	);
}
