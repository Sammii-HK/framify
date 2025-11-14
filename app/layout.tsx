import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import Navigation from "@/components/Navigation";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Framify - AI Framer Template Generator",
	description:
		"Generate Framer-ready website templates from natural language prompts",
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
