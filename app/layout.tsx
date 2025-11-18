import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import Navigation from "@/components/Navigation";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Lunary - Your AI-Powered Cosmic Guide",
	description:
		"Personalised daily insights, tarot interpretation, emotional patterns, and birth chart analysis — all based on you.",
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
				</Auth0Provider>
			</body>
		</html>
	);
}
