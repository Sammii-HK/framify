"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white rounded-framer-lg shadow-lg p-8 md:p-12 max-w-md w-full border border-framer-border"
			>
				<div className="text-center mb-8">
					<h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
						Welcome to Framify
					</h1>
					<p className="text-gray-600">
						Sign in to create and manage your templates
					</p>
				</div>

				<div className="space-y-4">
					<a
						href="/auth/login"
						className="w-full px-6 py-4 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer-lg font-medium hover:shadow-md transition-all flex items-center justify-center gap-2"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						Sign In
					</a>

					<div className="text-center text-sm text-gray-500 mt-6">
						<p>
							Don't have an account?{" "}
							<a
								href="/auth/login?screen_hint=signup"
								className="text-sky-500 hover:text-sky-600 font-medium"
							>
								Sign up
							</a>
						</p>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t border-gray-200">
					<p className="text-xs text-gray-500 text-center">
						By signing in, you agree to our Terms of Service and Privacy Policy
					</p>
				</div>
			</motion.div>
		</main>
	);
}
