"use client";

import { useState, useEffect, useRef } from "react";
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
	const [jsonInput, setJsonInput] = useState("");
	const [showJsonInput, setShowJsonInput] = useState(false);
	const [copied, setCopied] = useState(false);
	const [pasting, setPasting] = useState(false);
	const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const copyJsonTemplate = () => {
		const template = `{
  "name": "Template Name Here",
  "prompt": "Detailed prompt description here",
  "description": "Optional description",
  "category": "optional-category",
  "tags": ["tag1", "tag2", "tag3"]
}`;

		navigator.clipboard.writeText(template).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	const handlePasteFromClipboard = async () => {
		setPasting(true);
		try {
			const clipboardText = await navigator.clipboard.readText();
			
			if (!clipboardText.trim()) {
				alert("Clipboard is empty");
				setPasting(false);
				return;
			}

			try {
				const parsed = JSON.parse(clipboardText);
				
				// Auto-fill form fields
				if (parsed.name) setName(parsed.name);
				if (parsed.prompt) setPrompt(parsed.prompt);
				if (parsed.description) setDescription(parsed.description);
				if (parsed.category) setCategory(parsed.category);
				if (parsed.tags && Array.isArray(parsed.tags)) {
					setTags(parsed.tags.join(", "));
				}

				// Auto-save if complete (name + prompt)
				if (parsed.name && parsed.prompt && parsed.prompt.trim()) {
					setIsSaving(true);
					try {
						const response = await fetch("/api/prompt-templates", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								name: parsed.name,
								prompt: parsed.prompt,
								description: parsed.description || null,
								category: parsed.category || null,
								tags: Array.isArray(parsed.tags)
									? parsed.tags.map((t: string) => String(t).trim()).filter(Boolean)
									: [],
							}),
						});

						if (response.ok) {
							router.push("/style-bank");
							return; // Exit early on success
						} else {
							throw new Error("Failed to save");
						}
					} catch (error) {
						console.error("Error auto-saving:", error);
						alert("Failed to auto-save. Please check the form and save manually.");
					} finally {
						setIsSaving(false);
					}
				} else {
					// Incomplete JSON - show textarea for editing
					setJsonInput(clipboardText);
					setShowJsonInput(true);
				}
			} catch (error) {
				// Invalid JSON - show textarea for editing
				setJsonInput(clipboardText);
				setShowJsonInput(true);
				alert("Invalid JSON format. Please edit and try again.");
			}
		} catch (error) {
			alert("Failed to read from clipboard. Please paste manually.");
		} finally {
			setPasting(false);
		}
	};

	const handleJsonPaste = async () => {
		try {
			const parsed = JSON.parse(jsonInput);
			if (parsed.name) setName(parsed.name);
			if (parsed.prompt) setPrompt(parsed.prompt);
			if (parsed.description) setDescription(parsed.description);
			if (parsed.category) setCategory(parsed.category);
			if (parsed.tags && Array.isArray(parsed.tags)) {
				setTags(parsed.tags.join(", "));
			}
			setShowJsonInput(false);
			setJsonInput("");

			// Auto-save if required fields are complete
			if (parsed.name && parsed.prompt && parsed.prompt.trim()) {
				// Small delay to ensure state is updated
				setTimeout(async () => {
					setIsSaving(true);
					try {
						const response = await fetch("/api/prompt-templates", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								name: parsed.name,
								prompt: parsed.prompt,
								description: parsed.description || null,
								category: parsed.category || null,
								tags: parsed.tags
									? parsed.tags
											.split(",")
											.map((t: string) => t.trim())
											.filter(Boolean)
									: parsed.tags
										? Array.isArray(parsed.tags)
											? parsed.tags.map((t: string) => String(t).trim()).filter(Boolean)
											: []
										: [],
							}),
						});

						if (!response.ok) {
							throw new Error("Failed to save prompt template");
						}

						router.push("/style-bank");
					} catch (error) {
						console.error("Error auto-saving:", error);
						// Don't show alert - user can manually save if auto-save fails
					} finally {
						setIsSaving(false);
					}
				}, 100);
			}
		} catch (error) {
			alert("Invalid JSON format. Please check your JSON and try again.");
		}
	};

	// Auto-detect and fill JSON when pasted
	const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setJsonInput(value);

		// Clear existing timeout
		if (autoSaveTimeoutRef.current) {
			clearTimeout(autoSaveTimeoutRef.current);
			autoSaveTimeoutRef.current = null;
		}

		// Try to parse JSON as user types
		if (value.trim().startsWith("{") && value.trim().endsWith("}")) {
			try {
				const parsed = JSON.parse(value);
				// Auto-fill form fields immediately
				if (parsed.name) setName(parsed.name);
				if (parsed.prompt) setPrompt(parsed.prompt);
				if (parsed.description) setDescription(parsed.description);
				if (parsed.category) setCategory(parsed.category);
				if (parsed.tags && Array.isArray(parsed.tags)) {
					setTags(parsed.tags.join(", "));
				}

				// Auto-save if complete (name + prompt)
				if (parsed.name && parsed.prompt && parsed.prompt.trim()) {
					// Debounce auto-save - wait 1.5 seconds after user stops typing
					autoSaveTimeoutRef.current = setTimeout(async () => {
						setIsSaving(true);
						try {
							const response = await fetch("/api/prompt-templates", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									name: parsed.name,
									prompt: parsed.prompt,
									description: parsed.description || null,
									category: parsed.category || null,
									tags: Array.isArray(parsed.tags)
										? parsed.tags.map((t: string) => String(t).trim()).filter(Boolean)
										: [],
								}),
							});

							if (response.ok) {
								router.push("/style-bank");
							}
						} catch (error) {
							console.error("Error auto-saving:", error);
						} finally {
							setIsSaving(false);
						}
					}, 1500);
				}
			} catch (error) {
				// Invalid JSON - ignore, let user continue typing
			}
		}
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (autoSaveTimeoutRef.current) {
				clearTimeout(autoSaveTimeoutRef.current);
			}
		};
	}, []);

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
					<div className="flex items-center justify-between mb-2">
						<div>
							<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
								Save Prompt Template
							</h1>
							<p className="text-gray-600">
								Save a prompt to generate templates in all 4 styles
							</p>
						</div>
						<button
							type="button"
							onClick={copyJsonTemplate}
							className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 bg-sky-50 rounded-framer hover:bg-sky-100 transition-all"
						>
							{copied ? (
								<>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									Copied!
								</>
							) : (
								<>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
									</svg>
									Copy JSON Template
								</>
							)}
						</button>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border"
				>
					{/* JSON Input Mode */}
					{showJsonInput ? (
						<div className="space-y-4 mb-6">
							<div className="flex items-center justify-between mb-2">
								<label className="block text-sm font-medium text-gray-700">
									Paste JSON Template
								</label>
								<button
									type="button"
									onClick={() => {
										setShowJsonInput(false);
										setJsonInput("");
									}}
									className="text-sm text-gray-600 hover:text-gray-800"
								>
									Use Form Instead
								</button>
							</div>
							<textarea
								value={jsonInput}
								onChange={handleJsonInputChange}
								placeholder={`Paste JSON here (auto-fills and saves when complete):
{
  "name": "Template Name",
  "prompt": "Template prompt description",
  "description": "Optional description",
  "category": "optional-category",
  "tags": ["tag1", "tag2"]
}`}
								rows={12}
								className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
							/>
							<button
								type="button"
								onClick={handleJsonPaste}
								className="w-full px-6 py-3 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer-lg font-medium hover:shadow-md transition-all"
							>
								{isSaving ? "Saving..." : "Fill Form from JSON"}
							</button>
							{jsonInput.trim() && (
								<p className="text-xs text-gray-500 mt-2">
									💡 Tip: Paste valid JSON with &quot;name&quot; and &quot;prompt&quot; fields - it will auto-fill and save automatically!
								</p>
							)}
						</div>
					) : (
						<div className="mb-4">
							<button
								type="button"
								onClick={handlePasteFromClipboard}
								disabled={pasting || isSaving}
								className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{pasting ? (
									<>
										<motion.div
											className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full"
											animate={{ rotate: 360 }}
											transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
										/>
										Pasting...
									</>
								) : (
									<>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
										</svg>
										Paste JSON from Clipboard
									</>
								)}
							</button>
							<button
								type="button"
								onClick={() => setShowJsonInput(true)}
								className="ml-4 text-sm text-gray-600 hover:text-gray-800 font-medium"
							>
								Or type JSON manually →
							</button>
						</div>
					)}

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
						in multiple styles with one click!
					</p>
				</div>
			</div>
		</main>
	);
}
