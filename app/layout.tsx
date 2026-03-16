import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import Navigation from "@/components/Navigation";
import ChatWidget from "@/components/ChatWidget";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "CraftMyPage — Professional Websites for Local Businesses",
	description:
		"Create a beautiful, mobile-ready website for your business in minutes. No coding required. Free hosting included.",
	keywords: [
		"website builder",
		"local business website",
		"no code website",
		"free website hosting",
		"small business website",
		"professional website",
		"CraftMyPage",
	],
	openGraph: {
		title: "CraftMyPage — Professional Websites for Local Businesses",
		description:
			"Create a beautiful, mobile-ready website for your business in minutes. No coding required. Free hosting included.",
		type: "website",
		siteName: "CraftMyPage",
	},
	twitter: {
		card: "summary_large_image",
		title: "CraftMyPage — Professional Websites for Local Businesses",
		description:
			"Create a beautiful, mobile-ready website for your business in minutes. No coding required. Free hosting included.",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Auth0Provider>
					<Navigation />
					{children}
					<ChatWidget />
				</Auth0Provider>
			</body>
		</html>
	);
}
