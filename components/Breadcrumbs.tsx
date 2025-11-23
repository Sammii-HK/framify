import Link from 'next/link';
import { getBreadcrumbStructuredData } from '@/lib/seo';

interface BreadcrumbItem {
	name: string;
	url: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
	const structuredData = getBreadcrumbStructuredData(items);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<nav aria-label="Breadcrumb" className="mb-6">
				<ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
					{items.map((item, index) => (
						<li key={item.url} className="flex items-center">
							{index > 0 && (
								<span className="mx-2 text-gray-400" aria-hidden="true">
									/
								</span>
							)}
							{index === items.length - 1 ? (
								<span className="text-gray-900 font-medium" aria-current="page">
									{item.name}
								</span>
							) : (
								<Link
									href={item.url}
									className="hover:text-indigo-600 transition-colors"
								>
									{item.name}
								</Link>
							)}
						</li>
					))}
				</ol>
			</nav>
		</>
	);
}
