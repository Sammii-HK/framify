"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Navigation() {
	const pathname = usePathname();
	const { user, isLoading } = useUser();

	return (
		<nav className="border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4 max-w-7xl">
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
					>
						CraftMyPage
					</Link>

					<div className="flex items-center gap-4">
						<Link
							href="/templates"
							className={`px-4 py-2 rounded-lg font-medium transition-all ${
								pathname?.startsWith("/templates")
									? "bg-blue-600 text-white"
									: "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
							}`}
						>
							Templates
						</Link>
						<Link
							href="/generate"
							className={`px-4 py-2 rounded-lg font-medium transition-all ${
								pathname === "/generate"
									? "bg-blue-600 text-white"
									: "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
							}`}
						>
							Build Your Site
						</Link>
						{user && (
							<Link
								href="/dashboard"
								className={`px-4 py-2 rounded-lg font-medium transition-all ${
									pathname === "/dashboard"
										? "bg-blue-600 text-white"
										: "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
								}`}
							>
								Dashboard
							</Link>
						)}
						{isLoading ? (
							<div className="px-4 py-2 text-gray-400">Loading...</div>
						) : user ? (
							<div className="flex items-center gap-3">
								<span className="text-sm text-gray-600">
									{user.name || user.email}
								</span>
								<a
									href="/auth/logout"
									className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
								>
									Logout
								</a>
							</div>
						) : (
							<a
								href="/auth/login"
								className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
							>
								Login
							</a>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
