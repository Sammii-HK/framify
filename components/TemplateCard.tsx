"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice, getTierFromPrice, type PricingTier } from "@/lib/pricing";

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
	description?: string;
	category?: string;
	tags?: string[];
	thumbnailUrl?: string;
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

	const pricingTier = getTierFromPrice(template.price);
	const priceDisplay = formatPrice(template.price);
	const tierColors: Record<PricingTier, string> = {
		free: "bg-green-100 text-green-700 border-green-200",
		standard: "bg-blue-100 text-blue-700 border-blue-200",
		premium: "bg-purple-100 text-purple-700 border-purple-200",
	};

	return (
		<motion.div
			whileHover={{ y: -4 }}
			className="bg-white rounded-framer-lg shadow-sm border border-framer-border overflow-hidden hover:shadow-md transition-all"
		>
			{/* Thumbnail Placeholder */}
			{template.thumbnailUrl ? (
				<div className="w-full h-48 bg-gray-100 overflow-hidden">
					<img
						src={template.thumbnailUrl}
						alt={template.title}
						className="w-full h-full object-cover"
					/>
				</div>
			) : (
				<div className="w-full h-48 bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 flex items-center justify-center">
					<div className="text-center text-gray-400">
						<svg
							className="w-12 h-12 mx-auto mb-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<p className="text-xs">Preview</p>
					</div>
				</div>
			)}

			<div className="p-6">
				<div className="flex items-start justify-between mb-2">
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

				{/* Description or Prompt */}
				<p
					className="text-sm text-gray-600 mb-3 overflow-hidden"
					style={{
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
					}}
				>
					{template.description || template.prompt}
				</p>

				{/* Category Badge */}
				{template.category && template.category !== "general" && (
					<div className="mb-3">
						<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
							{template.category.replace("-", " ")}
						</span>
					</div>
				)}

				{/* Tags */}
				{template.tags && template.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 mb-3">
						{template.tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs"
							>
								{tag}
							</span>
						))}
						{template.tags.length > 3 && (
							<span className="px-2 py-0.5 text-gray-500 text-xs">
								+{template.tags.length - 3}
							</span>
						)}
					</div>
				)}

				<div className="flex items-center gap-3 mb-4">
					<span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
						{template.style}
					</span>
					<span className="text-xs text-gray-500">{formattedDate}</span>
				</div>

				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<span
							className={`px-3 py-1 rounded-full text-sm font-bold border ${tierColors[pricingTier]}`}
						>
							{priceDisplay}
						</span>
						{pricingTier !== "free" && (
							<span className="text-xs text-gray-500 capitalize">
								{pricingTier}
							</span>
						)}
					</div>
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
