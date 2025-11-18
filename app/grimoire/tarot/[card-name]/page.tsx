import { notFound } from 'next/navigation';
import { generatePageMetadata, generateStructuredData, getBreadcrumbStructuredData } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

// All tarot cards data
const allTarotCards = {
	majorArcana: [
		{ name: "The Fool", number: 0, upright: "New beginnings, innocence, spontaneity, a free spirit", reversed: "Recklessness, taken advantage of, inconsideration", element: "Air" },
		{ name: "The Magician", number: 1, upright: "Manifestation, resourcefulness, power, inspired action", reversed: "Manipulation, poor planning, untapped talents", element: "Air" },
		{ name: "The High Priestess", number: 2, upright: "Intuition, sacred knowledge, divine feminine, the subconscious mind", reversed: "Secrets, disconnected from intuition, withdrawal and silence", element: "Water" },
		{ name: "The Empress", number: 3, upright: "Femininity, beauty, nature, nurturing, abundance", reversed: "Creative block, dependence on others, smothering", element: "Earth" },
		{ name: "The Emperor", number: 4, upright: "Authority, establishment, structure, a father figure", reversed: "Domination, excessive control, lack of discipline, inflexibility", element: "Fire" },
		{ name: "The Hierophant", number: 5, upright: "Spiritual wisdom, religious beliefs, conformity, tradition, conformity", reversed: "Rebellion, subversiveness, new approaches, personal beliefs", element: "Earth" },
		{ name: "The Lovers", number: 6, upright: "Love, harmony, relationships, values alignment, choices", reversed: "Self-love, disharmony, imbalance, misalignment of values", element: "Air" },
		{ name: "The Chariot", number: 7, upright: "Control, willpower, success, action, determination", reversed: "Lack of control, lack of direction, aggression, no willpower", element: "Water" },
		{ name: "Strength", number: 8, upright: "Strength, courage, persuasion, influence, compassion", reversed: "Inner strength, self-doubt, weakness, insecurity", element: "Fire" },
		{ name: "The Hermit", number: 9, upright: "Soul searching, introspection, being alone, inner guidance", reversed: "Isolation, withdrawal, recluse, being anti-social", element: "Earth" },
		{ name: "Wheel of Fortune", number: 10, upright: "Good luck, karma, life cycles, destiny, a turning point", reversed: "Bad luck, resistance to change, breaking cycles, lack of control", element: "Fire" },
		{ name: "Justice", number: 11, upright: "Justice, fairness, truth, cause and effect, law", reversed: "Unfairness, lack of accountability, dishonesty, unfairness", element: "Air" },
		{ name: "The Hanged Man", number: 12, upright: "Pause, surrender, letting go, new perspectives", reversed: "Delays, resistance, stalling, indecision", element: "Water" },
		{ name: "Death", number: 13, upright: "Endings, change, transformation, transition", reversed: "Resistance to change, inability to move on, delaying the inevitable", element: "Water" },
		{ name: "Temperance", number: 14, upright: "Balance, moderation, patience, purpose", reversed: "Imbalance, excess, self-healing, realignment", element: "Fire" },
		{ name: "The Devil", number: 15, upright: "Shadow self, attachment, addiction, restriction, sexuality", reversed: "Releasing limiting beliefs, exploring dark thoughts, detachment", element: "Earth" },
		{ name: "The Tower", number: 16, upright: "Sudden change, upheaval, chaos, revelation, awakening", reversed: "Personal transformation, fear of change, averting disaster", element: "Fire" },
		{ name: "The Star", number: 17, upright: "Hope, faith, purpose, renewal, spirituality", reversed: "Lack of faith, despair, self-trust, disconnection", element: "Air" },
		{ name: "The Moon", number: 18, upright: "Illusion, fear, anxiety, subconscious, intuition", reversed: "Release of fear, repressed emotion, inner confusion", element: "Water" },
		{ name: "The Sun", number: 19, upright: "Positivity, fun, warmth, success, vitality", reversed: "Inner child, feeling down, overly optimistic", element: "Fire" },
		{ name: "Judgement", number: 20, upright: "Judgement, reflection, evaluation, karma, rebirth", reversed: "Lack of self awareness, doubt, self-loathing, ignoring the call", element: "Fire" },
		{ name: "The World", number: 21, upright: "Completion, accomplishment, fulfillment, sense of belonging", reversed: "Incompletion, lack of closure, lack of accomplishment", element: "Earth" },
	],
	wands: [
		{ name: "Ace of Wands", upright: "Creation, willpower, inspiration, desire", reversed: "Lack of energy, lack of passion, boredom", suit: "Wands" },
		{ name: "Two of Wands", upright: "Planning, making plans, discovery", reversed: "Lack of planning, lack of ambition", suit: "Wands" },
		{ name: "Three of Wands", upright: "Looking ahead, expansion, rapid growth", reversed: "Obstacles, delays, frustration", suit: "Wands" },
		{ name: "Four of Wands", upright: "Celebration, joy, harmony, relaxation", reversed: "Personal celebration, inner harmony, conflict with others", suit: "Wands" },
		{ name: "Five of Wands", upright: "Competition, rivalry, conflict", reversed: "Avoiding conflict, respecting differences", suit: "Wands" },
		{ name: "Six of Wands", upright: "Victory, success, public reward", reversed: "Excess pride, lack of recognition, punishment", suit: "Wands" },
		{ name: "Seven of Wands", upright: "Challenge, competition, protection", reversed: "Giving up, overwhelmed, overly protective", suit: "Wands" },
		{ name: "Eight of Wands", upright: "Rapid action, movement, quick decisions", reversed: "Panic, waiting, slowdown", suit: "Wands" },
		{ name: "Nine of Wands", upright: "Resilience, grit, last stand", reversed: "Exhaustion, fatigue, questioning motivations", suit: "Wands" },
		{ name: "Ten of Wands", upright: "Accomplishment, responsibility, burden", reversed: "Inability to delegate, overstressed, burnt out", suit: "Wands" },
		{ name: "Page of Wands", upright: "Exploration, excitement, freedom", reversed: "Lack of direction, procrastination, creating conflict", suit: "Wands" },
		{ name: "Knight of Wands", upright: "Action, adventure, fearlessness", reversed: "Anger, impulsiveness, recklessness", suit: "Wands" },
		{ name: "Queen of Wands", upright: "Courage, determination, joy", reversed: "Selfishness, jealousy, insecurities", suit: "Wands" },
		{ name: "King of Wands", upright: "Natural-born leader, vision, entrepreneur", reversed: "Impulsiveness, haste, ruthless, high expectations", suit: "Wands" },
	],
	cups: [
		{ name: "Ace of Cups", upright: "New feelings, spirituality, intuition", reversed: "Blocked emotions, self-love, disconnected feelings", suit: "Cups" },
		{ name: "Two of Cups", upright: "Unified love, partnership, mutual attraction", reversed: "Self-love, break-ups, disharmony, distrust", suit: "Cups" },
		{ name: "Three of Cups", upright: "Friendship, community, gatherings", reversed: "Overindulgence, gossip, isolation, third-party", suit: "Cups" },
		{ name: "Four of Cups", upright: "Meditation, contemplation, apathy, reevaluation", reversed: "Clarity, acceptance, choosing to engage", suit: "Cups" },
		{ name: "Five of Cups", upright: "Loss, grief, self-pity", reversed: "Acceptance, moving on, finding peace", suit: "Cups" },
		{ name: "Six of Cups", upright: "Revisiting the past, childhood memories, innocence", reversed: "Living in the past, forgiveness, naivety", suit: "Cups" },
		{ name: "Seven of Cups", upright: "Searching for purpose, choices, daydreaming", reversed: "Lack of purpose, diversion, confusion, wishful thinking", suit: "Cups" },
		{ name: "Eight of Cups", upright: "Walking away, disillusionment, leaving behind", reversed: "Avoidance, fear of change, fear of loss", suit: "Cups" },
		{ name: "Nine of Cups", upright: "Satisfaction, emotional stability, luxury", reversed: "Lack of inner joy, smugness, dissatisfaction", suit: "Cups" },
		{ name: "Ten of Cups", upright: "Divine love, blissful relationships, harmony, alignment", reversed: "Disconnection, misalignment of values, broken home", suit: "Cups" },
		{ name: "Page of Cups", upright: "Happy surprise, dreamer, sensitivity", reversed: "Emotional immaturity, insecurity, disappointment", suit: "Cups" },
		{ name: "Knight of Cups", upright: "Following the heart, idealist, romantic", reversed: "Moodiness, disappointment, emotionally immature", suit: "Cups" },
		{ name: "Queen of Cups", upright: "Compassionate, caring, emotionally stable", reversed: "Inner feelings, self-care, co-dependency", suit: "Cups" },
		{ name: "King of Cups", upright: "Emotional balance, compassion, diplomacy", reversed: "Emotional manipulation, moodiness, emotional abuse", suit: "Cups" },
	],
	swords: [
		{ name: "Ace of Swords", upright: "Breakthrough, clarity, sharp mind", reversed: "Confusion, brutality, chaos", suit: "Swords" },
		{ name: "Two of Swords", upright: "Difficult choices, indecision, stalemate", reversed: "Lesser of two evils, no right choice, confusion", suit: "Swords" },
		{ name: "Three of Swords", upright: "Heartbreak, emotional pain, sorrow, grief", reversed: "Recovery, forgiveness, moving on", suit: "Swords" },
		{ name: "Four of Swords", upright: "Rest, restoration, contemplation", reversed: "Restlessness, burnout, stress", suit: "Swords" },
		{ name: "Five of Swords", upright: "Unbridled ambition, win at all costs, sneakiness", reversed: "Resentment, desire to reconcile, forgiveness", suit: "Swords" },
		{ name: "Six of Swords", upright: "Transition, leaving behind, moving on", reversed: "Emotional baggage, unresolved issues, resisting transition", suit: "Swords" },
		{ name: "Seven of Swords", upright: "Deception, trickery, tactics and strategy", reversed: "Coming clean, rethinking approach, deception", suit: "Swords" },
		{ name: "Eight of Swords", upright: "Imprisonment, entrapment, self-victimization", reversed: "Self-acceptance, new perspective, freedom", suit: "Swords" },
		{ name: "Nine of Swords", upright: "Anxiety, worry, fear, depression, nightmares", reversed: "Hope, reaching out, despair, nightmares", suit: "Swords" },
		{ name: "Ten of Swords", upright: "Back-stabbed, betrayal, endings, loss", reversed: "Recovery, regeneration, resisting an inevitable end", suit: "Swords" },
		{ name: "Page of Swords", upright: "New ideas, curiosity, thirst for knowledge", reversed: "Deception, manipulation, all talk", suit: "Swords" },
		{ name: "Knight of Swords", upright: "Action, impulsiveness, defending beliefs", reversed: "No direction, disregard for consequences, unpredictability", suit: "Swords" },
		{ name: "Queen of Swords", upright: "Clear boundaries, direct communication, independence", reversed: "Cold hearted, cruel, bitterness", suit: "Swords" },
		{ name: "King of Swords", upright: "Mental clarity, intellectual power, authority", reversed: "Manipulation, tyrant, abusive, controlling", suit: "Swords" },
	],
	pentacles: [
		{ name: "Ace of Pentacles", upright: "New opportunity, resources, abundance", reversed: "Lost opportunity, lack of planning, bad investment", suit: "Pentacles" },
		{ name: "Two of Pentacles", upright: "Balancing decisions, priorities, adapting to change", reversed: "Loss of balance, disorganized, overwhelmed", suit: "Pentacles" },
		{ name: "Three of Pentacles", upright: "Teamwork, collaboration, learning", reversed: "Lack of teamwork, disorganized, group conflict", suit: "Pentacles" },
		{ name: "Four of Pentacles", upright: "Saving money, security, conservatism, scarcity", reversed: "Over-spending, greed, self-protection", suit: "Pentacles" },
		{ name: "Five of Pentacles", upright: "Need, poverty, insecurity, isolation", reversed: "Recovery, charity, poverty, isolation", suit: "Pentacles" },
		{ name: "Six of Pentacles", upright: "Charity, giving, prosperity, sharing wealth", reversed: "Strings attached, stinginess, power and domination", suit: "Pentacles" },
		{ name: "Seven of Pentacles", upright: "Long-term view, sustainable results, perseverance", reversed: "Lack of long-term vision, limited success or reward", suit: "Pentacles" },
		{ name: "Eight of Pentacles", upright: "Skill, talent, quality, high standards", reversed: "Self-development, perfectionism, lack of quality", suit: "Pentacles" },
		{ name: "Nine of Pentacles", upright: "Fruits of labor, rewards, luxury, self-sufficiency", reversed: "Overindulgence, reckless spending, false success", suit: "Pentacles" },
		{ name: "Ten of Pentacles", upright: "Wealth, financial security, family, long-term success", reversed: "Financial failure, lack of stability, family conflict", suit: "Pentacles" },
		{ name: "Page of Pentacles", upright: "Manifestation, financial opportunity, new job", reversed: "Lack of progress, procrastination, learn from failure", suit: "Pentacles" },
		{ name: "Knight of Pentacles", upright: "Efficiency, hard work, responsibility", reversed: "Laziness, obsessiveness, work without reward", suit: "Pentacles" },
		{ name: "Queen of Pentacles", upright: "Practicality, creature comforts, financial security", reversed: "Self-centeredness, jealousy, smothering", suit: "Pentacles" },
		{ name: "King of Pentacles", upright: "Wealth, business, security, discipline", reversed: "Financially irresponsible, obsessed with wealth and status", suit: "Pentacles" },
	],
};

// Helper function to normalize card names for URLs
function normalizeCardName(name: string): string {
	return name.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');
}

// Helper function to find card by normalized name
function findCard(cardName: string) {
	const normalized = cardName.toLowerCase().replace(/-/g, ' ');
	
	// Check Major Arcana
	for (const card of allTarotCards.majorArcana) {
		if (normalizeCardName(card.name) === cardName || 
			card.name.toLowerCase() === normalized) {
			return { ...card, type: 'Major Arcana', suit: null };
		}
	}
	
	// Check all suits
	const allSuits = [...allTarotCards.wands, ...allTarotCards.cups, ...allTarotCards.swords, ...allTarotCards.pentacles];
	for (const card of allSuits) {
		if (normalizeCardName(card.name) === cardName || 
			card.name.toLowerCase() === normalized) {
			return { ...card, type: 'Minor Arcana', suit: card.suit };
		}
	}
	
	return null;
}

interface TarotCardPageProps {
	params: Promise<{ 'card-name': string }>;
}

export async function generateStaticParams() {
	const allCards = [
		...allTarotCards.majorArcana.map(c => normalizeCardName(c.name)),
		...allTarotCards.wands.map(c => normalizeCardName(c.name)),
		...allTarotCards.cups.map(c => normalizeCardName(c.name)),
		...allTarotCards.swords.map(c => normalizeCardName(c.name)),
		...allTarotCards.pentacles.map(c => normalizeCardName(c.name)),
	];
	
	return allCards.map((cardName) => ({
		'card-name': cardName,
	}));
}

export async function generateMetadata({ params }: TarotCardPageProps): Promise<Metadata> {
	const { 'card-name': cardName } = await params;
	const card = findCard(cardName);
	
	if (!card) {
		return generatePageMetadata({
			title: 'Tarot Card Not Found',
			description: 'The requested tarot card could not be found.',
			path: `/grimoire/tarot/${cardName}`,
			noindex: true,
		});
	}
	
	const isReversed = cardName.includes('-reversed');
	const displayName = isReversed ? `${card.name} (Reversed)` : card.name;
	
	return generatePageMetadata({
		title: `${displayName} - Tarot Card Meaning | Lunary`,
		description: isReversed
			? `Discover the reversed meaning of ${card.name} tarot card: ${card.reversed}. Learn about reversed tarot card interpretations and spiritual guidance.`
			: `Learn the meaning of ${card.name} tarot card: ${card.upright}. Complete guide to tarot card interpretations, including reversed meanings, on Lunary.`,
		keywords: [
			card.name.toLowerCase(),
			`${card.name.toLowerCase()} tarot`,
			`${card.name.toLowerCase()} meaning`,
			isReversed ? `${card.name.toLowerCase()} reversed` : '',
			'tarot card meaning',
			'tarot reading',
			'tarot interpretation',
			card.element?.toLowerCase() || '',
			card.suit?.toLowerCase() || '',
		].filter(Boolean),
		path: `/grimoire/tarot/${cardName}`,
	});
}

export default async function TarotCardPage({ params }: TarotCardPageProps) {
	const { 'card-name': cardName } = await params;
	const card = findCard(cardName);
	const isReversed = cardName.includes('-reversed');
	
	if (!card) {
		notFound();
	}
	
	const displayName = isReversed ? `${card.name} (Reversed)` : card.name;
	const meaning = isReversed ? card.reversed : card.upright;
	const oppositeMeaning = isReversed ? card.upright : card.reversed;
	
	// Generate structured data
	const articleStructuredData = generateStructuredData({
		type: 'Article',
		data: {
			headline: `${displayName} - Tarot Card Meaning`,
			description: meaning,
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
		{ name: 'Tarot Cards', url: '/grimoire#tarot-cards' },
		{ name: displayName, url: `/grimoire/tarot/${cardName}` },
	]);
	
	// Find related cards (same suit or element)
	const relatedCards = [];
	if (card.type === 'Major Arcana') {
		const sameElement = allTarotCards.majorArcana
			.filter(c => c.element === card.element && c.name !== card.name)
			.slice(0, 3);
		relatedCards.push(...sameElement);
	} else if (card.suit) {
		const suitCards = {
			'Wands': allTarotCards.wands,
			'Cups': allTarotCards.cups,
			'Swords': allTarotCards.swords,
			'Pentacles': allTarotCards.pentacles,
		}[card.suit] || [];
		const sameSuit = suitCards
			.filter(c => c.name !== card.name)
			.slice(0, 3);
		relatedCards.push(...sameSuit);
	}
	
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
						{ name: 'Tarot Cards', url: '/grimoire#tarot-cards' },
						{ name: displayName, url: `/grimoire/tarot/${cardName}` },
					]}
				/>
				
				<div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 mb-8">
					<div className="mb-6">
						<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
							{displayName}
						</h1>
						<div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
							{card.type && (
								<span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
									{card.type}
								</span>
							)}
							{card.suit && (
								<span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
									Suit of {card.suit}
								</span>
							)}
							{card.element && (
								<span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full">
									{card.element} Element
								</span>
							)}
							{card.number !== undefined && (
								<span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
									#{card.number}
								</span>
							)}
						</div>
					</div>
					
					<div className="space-y-6">
						<div>
							<h2 className="text-2xl font-bold mb-3 text-gray-900">
								{isReversed ? 'Reversed Meaning' : 'Upright Meaning'}
							</h2>
							<p className="text-lg text-gray-700 leading-relaxed">
								{meaning}
							</p>
						</div>
						
						<div className="border-t pt-6">
							<h2 className="text-2xl font-bold mb-3 text-gray-900">
								{isReversed ? 'Upright Meaning' : 'Reversed Meaning'}
							</h2>
							<p className="text-lg text-gray-700 leading-relaxed">
								{oppositeMeaning}
							</p>
							{!isReversed && (
								<Link
									href={`/grimoire/tarot/${normalizeCardName(card.name)}-reversed`}
									className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
								>
									Learn more about {card.name} reversed →
								</Link>
							)}
							{isReversed && (
								<Link
									href={`/grimoire/tarot/${normalizeCardName(card.name)}`}
									className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
								>
									View {card.name} upright meaning →
								</Link>
							)}
						</div>
					</div>
				</div>
				
				{relatedCards.length > 0 && (
					<div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
						<h2 className="text-2xl font-bold mb-4 text-gray-900">
							Related Tarot Cards
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{relatedCards.map((relatedCard) => (
								<Link
									key={relatedCard.name}
									href={`/grimoire/tarot/${normalizeCardName(relatedCard.name)}`}
									className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
								>
									<h3 className="font-semibold text-gray-900 mb-2">
										{relatedCard.name}
									</h3>
									<p className="text-sm text-gray-600">
										{relatedCard.upright.substring(0, 80)}...
									</p>
								</Link>
							))}
						</div>
					</div>
				)}
				
				<div className="mt-8 text-center">
					<Link
						href="/grimoire#tarot-cards"
						className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
					>
						← Back to All Tarot Cards
					</Link>
				</div>
			</div>
		</main>
	);
}
