"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Template {
	id: string;
	title: string;
	prompt: string;
	style: string;
	framerUrl: string | null;
	createdAt: string;
	price?: number;
	isPublic?: boolean;
	viewCount?: number;
}

interface TemplateCardProps {
	template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
	const date = new Date(template.createdAt);
	const formattedDate = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	return (
		<motion.div
			whileHover={{ y: -4 }}
			className="bg-white rounded-framer-lg shadow-sm border border-framer-border overflow-hidden hover:shadow-md transition-all"
		>
			<div className="p-6">
				<div className="flex items-start justify-between mb-3">
					<h3
						className="text-xl font-semibold text-framer-text flex-1 overflow-hidden"
						style={{
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
						}}
					>
						{template.title}
					</h3>
				</div>

				<p
					className="text-sm text-gray-600 mb-4 overflow-hidden"
					style={{
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
					}}
				>
					{template.prompt}
				</p>

				<div className="flex items-center gap-3 mb-4">
					<span
						className={`px-3 py-1 rounded-full text-xs font-medium ${
							template.style === "Minimal"
								? "bg-gray-100 text-gray-700"
								: template.style === "Bold"
								? "bg-red-100 text-red-700"
								: template.style === "Soft"
								? "bg-pink-100 text-pink-700"
								: "bg-gray-800 text-gray-100"
						}`}
					>
						{template.style}
					</span>
					<span className="text-xs text-gray-500">{formattedDate}</span>
				</div>

				<div className="flex items-center justify-between mb-4">
					{template.price !== undefined && template.price > 0 ? (
						<div className="text-2xl font-bold text-framer-text">
							${template.price}
						</div>
					) : (
						<div className="text-sm font-medium text-green-600">Free</div>
					)}
					{template.viewCount !== undefined && template.viewCount > 0 && (
						<div className="text-xs text-gray-500">
							{template.viewCount} views
						</div>
					)}
				</div>

				<div className="flex gap-2">
					<Link
						href={`/template/${template.id}`}
						className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-framer text-sm font-medium hover:bg-gray-200 transition-all text-center"
					>
						View
					</Link>
					{template.price !== undefined && template.price > 0 ? (
						<Link
							href={`/template/${template.id}?purchase=true`}
							className="px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer text-sm font-medium hover:shadow-md transition-all"
						>
							Buy
						</Link>
					) : (
						template.framerUrl && (
							<a
								href={template.framerUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer text-sm font-medium hover:shadow-md transition-all"
							>
								Open in Framer
							</a>
						)
					)}
				</div>
			</div>
		</motion.div>
	);
}
