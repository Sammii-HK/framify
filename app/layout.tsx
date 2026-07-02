import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import Navigation from "@/components/Navigation";
import ChatWidget from "@/components/ChatWidget";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://craftmypage.com"),
	title: {
		default: "CraftMyPage — Professional Websites for Local Businesses",
		template: "%s | CraftMyPage",
	},
	description:
		"Create a beautiful, mobile-ready website for your local business in minutes. No coding required. Hosting, domain, and deployment all sorted for you.",
	keywords: [
		"website builder for local businesses",
		"small business website builder",
		"get a website for my business",
		"local business website",
		"no code website builder",
		"free website hosting",
		"professional website builder",
		"CraftMyPage",
	],
	openGraph: {
		title: "CraftMyPage — Professional Websites for Local Businesses",
		description:
			"Create a beautiful, mobile-ready website for your local business in minutes. No coding required. Hosting, domain, and deployment all sorted for you.",
		type: "website",
		siteName: "CraftMyPage",
		url: "https://craftmypage.com",
		images: [
			{
				url: "/opengraph-image",
				width: 1200,
				height: 630,
				alt: "CraftMyPage — Professional Websites for Local Businesses",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "CraftMyPage — Professional Websites for Local Businesses",
		description:
			"Create a beautiful, mobile-ready website for your local business in minutes. No coding required. Hosting, domain, and deployment all sorted for you.",
		images: ["/opengraph-image"],
	},
	alternates: {
		canonical: "https://craftmypage.com",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-snippet": -1,
			"max-image-preview": "large",
			"max-video-preview": -1,
		},
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100`}>
				<Auth0Provider>
					<Navigation />
					{children}
					<ChatWidget />
				</Auth0Provider>
			</body>
		</html>
	);
}
