"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPromptTemplatePage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [prompt, setPrompt] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [tags, setTags] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name || !prompt.trim()) {
			alert("Name and prompt are required");
			return;
		}

		setIsSaving(true);

		try {
			const response = await fetch("/api/prompt-templates", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					prompt,
					description: description || null,
					category: category || null,
					tags: tags
						.split(",")
						.map((t) => t.trim())
						.filter(Boolean),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to save prompt template");
			}

			router.push("/style-bank");
		} catch (error) {
			console.error("Error saving prompt:", error);
			alert("Failed to save prompt template");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
			<div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
				<div className="mb-6">
					<Link
						href="/style-bank"
						className="text-sky-600 hover:text-sky-700 font-medium mb-4 inline-block"
					>
						← Back to Style Bank
					</Link>
					<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
						Save Prompt Template
					</h1>
					<p className="text-gray-600">
						Save a prompt to generate templates in all 4 styles
					</p>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border"
				>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Template Name *
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g., Startup Launch Page"
								className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Prompt *
							</label>
							<textarea
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								placeholder="e.g., A modern landing page for a tech startup with hero section, features, and CTA"
								rows={5}
								className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all resize-none"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description (optional)
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Brief description of what this template creates"
								rows={3}
								className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all resize-none"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Category (optional)
								</label>
								<input
									type="text"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									placeholder="e.g., landing-page"
									className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Tags (comma-separated)
								</label>
								<input
									type="text"
									value={tags}
									onChange={(e) => setTags(e.target.value)}
									placeholder="startup, tech, modern"
									className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all"
								/>
							</div>
						</div>

						<div className="flex gap-3 pt-4">
							<motion.button
								type="submit"
								disabled={isSaving}
								whileHover={{ scale: isSaving ? 1 : 1.02 }}
								whileTap={{ scale: isSaving ? 1 : 0.98 }}
								className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{isSaving ? (
									<>
										<motion.div
											className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
											animate={{ rotate: 360 }}
											transition={{
												duration: 1,
												repeat: Infinity,
												ease: "linear",
											}}
										/>
										<span>Saving...</span>
									</>
								) : (
									"Save Prompt Template"
								)}
							</motion.button>
							<Link
								href="/style-bank"
								className="px-6 py-3 bg-gray-100 text-gray-700 rounded-framer-lg font-medium hover:bg-gray-200 transition-all"
							>
								Cancel
							</Link>
						</div>
					</form>
				</motion.div>

				<div className="mt-6 bg-blue-50 border border-blue-200 rounded-framer-lg p-4">
					<p className="text-sm text-blue-800">
						<strong>Tip:</strong> After saving, you can generate this template
						in all 4 styles (Minimal, Bold, Soft, Dark) with one click!
					</p>
				</div>
			</div>
		</main>
	);
}
