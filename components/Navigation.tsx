"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
	const pathname = usePathname();

	return (
		<nav className="border-b border-framer-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4 max-w-7xl">
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
					>
						Framify
					</Link>

					<div className="flex items-center gap-4">
						<Link
							href="/"
							className={`px-4 py-2 rounded-framer font-medium transition-all ${
								pathname === "/"
									? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white"
									: "text-gray-700 hover:bg-gray-100"
							}`}
						>
							Create
						</Link>
						<Link
							href="/marketplace"
							className={`px-4 py-2 rounded-framer font-medium transition-all ${
								pathname === "/marketplace"
									? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white"
									: "text-gray-700 hover:bg-gray-100"
							}`}
						>
							Marketplace
						</Link>
						<Link
							href="/style-bank"
							className={`px-4 py-2 rounded-framer font-medium transition-all ${
								pathname === "/style-bank"
									? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white"
									: "text-gray-700 hover:bg-gray-100"
							}`}
						>
							Style Bank
						</Link>
						<Link
							href="/dashboard"
							className={`px-4 py-2 rounded-framer font-medium transition-all ${
								pathname === "/dashboard"
									? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white"
									: "text-gray-700 hover:bg-gray-100"
							}`}
						>
							Dashboard
						</Link>
						<Link
							href="/admin"
							className={`px-4 py-2 rounded-framer font-medium transition-all ${
								pathname === "/admin"
									? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white"
									: "text-gray-700 hover:bg-gray-100"
							}`}
						>
							Admin
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
