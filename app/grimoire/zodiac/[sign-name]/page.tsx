import { notFound } from 'next/navigation';
import { generatePageMetadata, generateStructuredData, getBreadcrumbStructuredData } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

const zodiacSigns = [
	{
		name: "Aries",
		dates: "March 21 - April 19",
		element: "Fire",
		planet: "Mars",
		symbol: "♈",
		traits: "Bold, ambitious, confident, competitive",
		description: "Aries is the first sign of the zodiac, representing new beginnings and raw energy. Ruled by Mars, Aries individuals are natural leaders who charge ahead with passion and determination.",
		strengths: "Courageous, determined, confident, enthusiastic, optimistic, honest, passionate",
		weaknesses: "Impatient, moody, short-tempered, impulsive, aggressive",
		compatible: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
		incompatible: ["Cancer", "Capricorn"],
	},
	{
		name: "Taurus",
		dates: "April 20 - May 20",
		element: "Earth",
		planet: "Venus",
		symbol: "♉",
		traits: "Stable, practical, sensual, determined",
		description: "Taurus is an earth sign known for its grounded nature and appreciation of life's pleasures. Ruled by Venus, Taurus individuals value stability, beauty, and comfort.",
		strengths: "Reliable, patient, practical, devoted, responsible, stable",
		weaknesses: "Stubborn, possessive, uncompromising, indulgent, lazy",
		compatible: ["Virgo", "Capricorn", "Cancer", "Pisces"],
		incompatible: ["Leo", "Aquarius"],
	},
	{
		name: "Gemini",
		dates: "May 21 - June 20",
		element: "Air",
		planet: "Mercury",
		symbol: "♊",
		traits: "Curious, adaptable, communicative, versatile",
		description: "Gemini is an air sign represented by the twins, symbolizing duality and versatility. Ruled by Mercury, Gemini individuals are quick-witted, curious, and excellent communicators.",
		strengths: "Gentle, affectionate, curious, adaptable, ability to learn quickly and exchange ideas",
		weaknesses: "Nervous, inconsistent, indecisive",
		compatible: ["Libra", "Aquarius", "Aries", "Leo"],
		incompatible: ["Virgo", "Pisces"],
	},
	{
		name: "Cancer",
		dates: "June 21 - July 22",
		element: "Water",
		planet: "Moon",
		symbol: "♋",
		traits: "Intuitive, emotional, nurturing, protective",
		description: "Cancer is a water sign known for its emotional depth and nurturing nature. Ruled by the Moon, Cancer individuals are highly intuitive and deeply connected to their emotions and family.",
		strengths: "Tenacious, highly imaginative, loyal, emotional, sympathetic, persuasive",
		weaknesses: "Moody, pessimistic, suspicious, manipulative, insecure",
		compatible: ["Scorpio", "Pisces", "Taurus", "Virgo"],
		incompatible: ["Aries", "Libra"],
	},
	{
		name: "Leo",
		dates: "July 23 - August 22",
		element: "Fire",
		planet: "Sun",
		symbol: "♌",
		traits: "Confident, creative, generous, passionate",
		description: "Leo is a fire sign ruled by the Sun, representing warmth, creativity, and leadership. Leo individuals are natural-born leaders who radiate confidence and charisma.",
		strengths: "Creative, passionate, generous, warm-hearted, cheerful, humorous",
		weaknesses: "Arrogant, stubborn, self-centered, lazy, inflexible",
		compatible: ["Aries", "Sagittarius", "Gemini", "Libra"],
		incompatible: ["Taurus", "Scorpio"],
	},
	{
		name: "Virgo",
		dates: "August 23 - September 22",
		element: "Earth",
		planet: "Mercury",
		symbol: "♍",
		traits: "Analytical, practical, detail-oriented, perfectionist",
		description: "Virgo is an earth sign known for its analytical mind and attention to detail. Ruled by Mercury, Virgo individuals are practical, methodical, and strive for perfection.",
		strengths: "Loyal, analytical, kind, hardworking, practical",
		weaknesses: "Worrying, shy, overly critical of self and others, all work and no play",
		compatible: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
		incompatible: ["Gemini", "Sagittarius"],
	},
	{
		name: "Libra",
		dates: "September 23 - October 22",
		element: "Air",
		planet: "Venus",
		symbol: "♎",
		traits: "Diplomatic, balanced, harmonious, aesthetic",
		description: "Libra is an air sign ruled by Venus, representing balance, harmony, and beauty. Libra individuals are natural diplomats who seek fairness and aesthetic pleasure in all things.",
		strengths: "Cooperative, diplomatic, gracious, fair-minded, social",
		weaknesses: "Indecisive, avoids confrontations, will carry a grudge, self-pity",
		compatible: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
		incompatible: ["Cancer", "Capricorn"],
	},
	{
		name: "Scorpio",
		dates: "October 23 - November 21",
		element: "Water",
		planet: "Pluto",
		symbol: "♏",
		traits: "Intense, passionate, mysterious, transformative",
		description: "Scorpio is a water sign ruled by Pluto, representing transformation, intensity, and deep emotional connections. Scorpio individuals are known for their passion and mysterious nature.",
		strengths: "Resourceful, brave, passionate, stubborn, a true friend",
		weaknesses: "Distrusting, jealous, secretive, violent",
		compatible: ["Cancer", "Pisces", "Virgo", "Capricorn"],
		incompatible: ["Leo", "Aquarius"],
	},
	{
		name: "Sagittarius",
		dates: "November 22 - December 21",
		element: "Fire",
		planet: "Jupiter",
		symbol: "♐",
		traits: "Adventurous, optimistic, philosophical, freedom-loving",
		description: "Sagittarius is a fire sign ruled by Jupiter, representing adventure, philosophy, and expansion. Sagittarius individuals are optimistic explorers who seek truth and freedom.",
		strengths: "Generous, idealistic, great sense of humor",
		weaknesses: "Promises more than can deliver, very impatient, will say anything no matter how undiplomatic",
		compatible: ["Aries", "Leo", "Libra", "Aquarius"],
		incompatible: ["Virgo", "Pisces"],
	},
	{
		name: "Capricorn",
		dates: "December 22 - January 19",
		element: "Earth",
		planet: "Saturn",
		symbol: "♑",
		traits: "Ambitious, disciplined, responsible, practical",
		description: "Capricorn is an earth sign ruled by Saturn, representing discipline, ambition, and responsibility. Capricorn individuals are hardworking achievers who value structure and tradition.",
		strengths: "Responsible, disciplined, self-control, good managers",
		weaknesses: "Know-it-all, unforgiving, condescending, expecting the worst",
		compatible: ["Taurus", "Virgo", "Scorpio", "Pisces"],
		incompatible: ["Aries", "Libra"],
	},
	{
		name: "Aquarius",
		dates: "January 20 - February 18",
		element: "Air",
		planet: "Uranus",
		symbol: "♒",
		traits: "Independent, innovative, humanitarian, intellectual",
		description: "Aquarius is an air sign ruled by Uranus, representing innovation, independence, and humanitarian ideals. Aquarius individuals are forward-thinking visionaries who value freedom and progress.",
		strengths: "Progressive, original, independent, humanitarian",
		weaknesses: "Runs from emotional expression, temperamental, uncompromising, aloof",
		compatible: ["Gemini", "Libra", "Aries", "Sagittarius"],
		incompatible: ["Taurus", "Scorpio"],
	},
	{
		name: "Pisces",
		dates: "February 19 - March 20",
		element: "Water",
		planet: "Neptune",
		symbol: "♓",
		traits: "Intuitive, compassionate, artistic, dreamy",
		description: "Pisces is a water sign ruled by Neptune, representing intuition, compassion, and artistic expression. Pisces individuals are empathetic dreamers deeply connected to the spiritual realm.",
		strengths: "Compassionate, artistic, intuitive, gentle, wise, musical",
		weaknesses: "Fearful, overly trusting, sad, desire to escape reality, can be a victim or a martyr",
		compatible: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
		incompatible: ["Gemini", "Sagittarius"],
	},
];

function normalizeSignName(name: string): string {
	return name.toLowerCase();
}

function findSign(signName: string) {
	const normalized = signName.toLowerCase();
	return zodiacSigns.find(sign => normalizeSignName(sign.name) === normalized) || null;
}

interface ZodiacSignPageProps {
	params: Promise<{ 'sign-name': string }>;
}

export async function generateStaticParams() {
	return zodiacSigns.map((sign) => ({
		'sign-name': normalizeSignName(sign.name),
	}));
}

export async function generateMetadata({ params }: ZodiacSignPageProps): Promise<Metadata> {
	const { 'sign-name': signName } = await params;
	const sign = findSign(signName);
	
	if (!sign) {
		return generatePageMetadata({
			title: 'Zodiac Sign Not Found',
			description: 'The requested zodiac sign could not be found.',
			path: `/grimoire/zodiac/${signName}`,
			noindex: true,
		});
	}
	
	return generatePageMetadata({
		title: `${sign.name} Zodiac Sign - Traits, Dates & Compatibility | Lunary`,
		description: `Discover everything about ${sign.name} zodiac sign: dates (${sign.dates}), traits, compatibility, strengths, weaknesses, and more. ${sign.name} is a ${sign.element} sign ruled by ${sign.planet}.`,
		keywords: [
			sign.name.toLowerCase(),
			`${sign.name.toLowerCase()} zodiac`,
			`${sign.name.toLowerCase()} sign`,
			`${sign.name.toLowerCase()} traits`,
			`${sign.name.toLowerCase()} compatibility`,
			sign.element.toLowerCase(),
			sign.planet.toLowerCase(),
			'zodiac signs',
			'astrology',
			'horoscope',
		],
		path: `/grimoire/zodiac/${signName}`,
	});
}

export default async function ZodiacSignPage({ params }: ZodiacSignPageProps) {
	const { 'sign-name': signName } = await params;
	const sign = findSign(signName);
	
	if (!sign) {
		notFound();
	}
	
	// Generate structured data
	const articleStructuredData = generateStructuredData({
		type: 'Article',
		data: {
			headline: `${sign.name} Zodiac Sign - Complete Guide`,
			description: sign.description,
			author: {
				'@type': 'Organization',
				name: 'Lunary',
			},
			publisher: {
				'@type': 'Organization',
				name: 'Lunary',
			},
		},
	});
	
	const breadcrumbs = getBreadcrumbStructuredData([
		{ name: 'Home', url: '/' },
		{ name: 'The Grimoire', url: '/grimoire' },
		{ name: 'Zodiac Signs', url: '/grimoire#zodiac-signs' },
		{ name: sign.name, url: `/grimoire/zodiac/${signName}` },
	]);
	
	// Find compatible and incompatible signs
	const compatibleSigns = zodiacSigns.filter(s => sign.compatible.includes(s.name));
	const incompatibleSigns = zodiacSigns.filter(s => sign.incompatible.includes(s.name));
	const sameElementSigns = zodiacSigns.filter(s => s.element === sign.element && s.name !== sign.name);
	
	return (
		<main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
			/>
			<div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
				<Breadcrumbs
					items={[
						{ name: 'Home', url: '/' },
						{ name: 'The Grimoire', url: '/grimoire' },
						{ name: 'Zodiac Signs', url: '/grimoire#zodiac-signs' },
						{ name: sign.name, url: `/grimoire/zodiac/${signName}` },
					]}
				/>
				
				<div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 mb-8">
					<div className="mb-6">
						<div className="flex items-center gap-4 mb-4">
							<span className="text-6xl">{sign.symbol}</span>
							<div>
								<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
									{sign.name}
								</h1>
								<p className="text-gray-600 text-lg">{sign.dates}</p>
							</div>
						</div>
						<div className="flex flex-wrap gap-3 text-sm">
							<span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
								{sign.element} Element
							</span>
							<span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
								Ruled by {sign.planet}
							</span>
						</div>
					</div>
					
					<div className="space-y-6">
						<div>
							<h2 className="text-2xl font-bold mb-3 text-gray-900">About {sign.name}</h2>
							<p className="text-lg text-gray-700 leading-relaxed">
								{sign.description}
							</p>
						</div>
						
						<div>
							<h2 className="text-2xl font-bold mb-3 text-gray-900">Key Traits</h2>
							<p className="text-lg text-gray-700 mb-4">{sign.traits}</p>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-xl font-semibold mb-3 text-green-700">Strengths</h3>
								<p className="text-gray-700">{sign.strengths}</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-3 text-red-700">Weaknesses</h3>
								<p className="text-gray-700">{sign.weaknesses}</p>
							</div>
						</div>
					</div>
				</div>
				
				{compatibleSigns.length > 0 && (
					<div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 mb-8">
						<h2 className="text-2xl font-bold mb-4 text-gray-900">
							Most Compatible Signs
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{compatibleSigns.map((compatibleSign) => (
								<Link
									key={compatibleSign.name}
									href={`/grimoire/zodiac/${normalizeSignName(compatibleSign.name)}`}
									className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all text-center"
								>
									<span className="text-3xl mb-2 block">{compatibleSign.symbol}</span>
									<h3 className="font-semibold text-gray-900">{compatibleSign.name}</h3>
								</Link>
							))}
						</div>
					</div>
				)}
				
				{sameElementSigns.length > 0 && (
					<div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 mb-8">
						<h2 className="text-2xl font-bold mb-4 text-gray-900">
							Other {sign.element} Signs
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{sameElementSigns.map((elementSign) => (
								<Link
									key={elementSign.name}
									href={`/grimoire/zodiac/${normalizeSignName(elementSign.name)}`}
									className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all text-center"
								>
									<span className="text-3xl mb-2 block">{elementSign.symbol}</span>
									<h3 className="font-semibold text-gray-900">{elementSign.name}</h3>
								</Link>
							))}
						</div>
					</div>
				)}
				
				<div className="mt-8 text-center">
					<Link
						href="/grimoire#zodiac-signs"
						className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
					>
						← Back to All Zodiac Signs
					</Link>
				</div>
			</div>
		</main>
	);
}
