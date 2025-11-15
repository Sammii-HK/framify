"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Navigation() {
	const pathname = usePathname();
	const { user, isLoading } = useUser();

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
						{user && (
							<>
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
							</>
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
									className="px-4 py-2 bg-gray-100 text-gray-700 rounded-framer font-medium hover:bg-gray-200 transition-all"
								>
									Logout
								</a>
							</div>
						) : (
							<a
								href="/auth/login"
								onClick={(e) => {
									console.log('Login clicked, navigating to:', e.currentTarget.href);
								}}
								className="px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer font-medium hover:shadow-md transition-all"
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
