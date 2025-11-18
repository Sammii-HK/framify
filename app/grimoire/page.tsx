import { generatePageMetadata, generateStructuredData } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = generatePageMetadata({
	title: "The Grimoire - Complete Astrology & Tarot Reference | Lunary",
	description:
		"Explore the most comprehensive index of astrology knowledge, tarot cards (including reversed meanings), zodiac signs, birth charts, moon phases, and mystical wisdom. Your complete spiritual reference guide on Lunary.",
	keywords: [
		"grimoire",
		"tarot card meanings",
		"reversed tarot",
		"tarot card guide",
		"complete tarot deck",
		"astrology reference",
		"zodiac sign meanings",
		"birth chart interpretation",
		"moon phases guide",
		"astrology symbols",
		"tarot spreads",
		"astrology houses",
		"planetary aspects",
	],
	path: "/grimoire",
});

// Comprehensive Tarot Card Data
const tarotCards = {
	majorArcana: [
		{
			name: "The Fool",
			number: 0,
			upright: "New beginnings, innocence, spontaneity, a free spirit",
			reversed: "Recklessness, taken advantage of, inconsideration",
			element: "Air",
		},
		{
			name: "The Magician",
			number: 1,
			upright: "Manifestation, resourcefulness, power, inspired action",
			reversed: "Manipulation, poor planning, untapped talents",
			element: "Air",
		},
		{
			name: "The High Priestess",
			number: 2,
			upright: "Intuition, sacred knowledge, divine feminine, the subconscious mind",
			reversed: "Secrets, disconnected from intuition, withdrawal and silence",
			element: "Water",
		},
		{
			name: "The Empress",
			number: 3,
			upright: "Femininity, beauty, nature, nurturing, abundance",
			reversed: "Creative block, dependence on others, smothering",
			element: "Earth",
		},
		{
			name: "The Emperor",
			number: 4,
			upright: "Authority, establishment, structure, a father figure",
			reversed: "Domination, excessive control, lack of discipline, inflexibility",
			element: "Fire",
		},
		{
			name: "The Hierophant",
			number: 5,
			upright: "Spiritual wisdom, religious beliefs, conformity, tradition, conformity",
			reversed: "Rebellion, subversiveness, new approaches, personal beliefs",
			element: "Earth",
		},
		{
			name: "The Lovers",
			number: 6,
			upright: "Love, harmony, relationships, values alignment, choices",
			reversed: "Self-love, disharmony, imbalance, misalignment of values",
			element: "Air",
		},
		{
			name: "The Chariot",
			number: 7,
			upright: "Control, willpower, success, action, determination",
			reversed: "Lack of control, lack of direction, aggression, no willpower",
			element: "Water",
		},
		{
			name: "Strength",
			number: 8,
			upright: "Strength, courage, persuasion, influence, compassion",
			reversed: "Inner strength, self-doubt, weakness, insecurity",
			element: "Fire",
		},
		{
			name: "The Hermit",
			number: 9,
			upright: "Soul searching, introspection, being alone, inner guidance",
			reversed: "Isolation, withdrawal, recluse, being anti-social",
			element: "Earth",
		},
		{
			name: "Wheel of Fortune",
			number: 10,
			upright: "Good luck, karma, life cycles, destiny, a turning point",
			reversed: "Bad luck, resistance to change, breaking cycles, lack of control",
			element: "Fire",
		},
		{
			name: "Justice",
			number: 11,
			upright: "Justice, fairness, truth, cause and effect, law",
			reversed: "Unfairness, lack of accountability, dishonesty, unfairness",
			element: "Air",
		},
		{
			name: "The Hanged Man",
			number: 12,
			upright: "Pause, surrender, letting go, new perspectives",
			reversed: "Delays, resistance, stalling, indecision",
			element: "Water",
		},
		{
			name: "Death",
			number: 13,
			upright: "Endings, change, transformation, transition",
			reversed: "Resistance to change, inability to move on, delaying the inevitable",
			element: "Water",
		},
		{
			name: "Temperance",
			number: 14,
			upright: "Balance, moderation, patience, purpose",
			reversed: "Imbalance, excess, self-healing, realignment",
			element: "Fire",
		},
		{
			name: "The Devil",
			number: 15,
			upright: "Shadow self, attachment, addiction, restriction, sexuality",
			reversed: "Releasing limiting beliefs, exploring dark thoughts, detachment",
			element: "Earth",
		},
		{
			name: "The Tower",
			number: 16,
			upright: "Sudden change, upheaval, chaos, revelation, awakening",
			reversed: "Personal transformation, fear of change, averting disaster",
			element: "Fire",
		},
		{
			name: "The Star",
			number: 17,
			upright: "Hope, faith, purpose, renewal, spirituality",
			reversed: "Lack of faith, despair, self-trust, disconnection",
			element: "Air",
		},
		{
			name: "The Moon",
			number: 18,
			upright: "Illusion, fear, anxiety, subconscious, intuition",
			reversed: "Release of fear, repressed emotion, inner confusion",
			element: "Water",
		},
		{
			name: "The Sun",
			number: 19,
			upright: "Positivity, fun, warmth, success, vitality",
			reversed: "Inner child, feeling down, overly optimistic",
			element: "Fire",
		},
		{
			name: "Judgement",
			number: 20,
			upright: "Judgement, reflection, evaluation, karma, rebirth",
			reversed: "Lack of self awareness, doubt, self-loathing, ignoring the call",
			element: "Fire",
		},
		{
			name: "The World",
			number: 21,
			upright: "Completion, accomplishment, fulfillment, sense of belonging",
			reversed: "Incompletion, lack of closure, lack of accomplishment",
			element: "Earth",
		},
	],
	suits: {
		wands: [
			{ name: "Ace of Wands", upright: "Creation, willpower, inspiration, desire", reversed: "Lack of energy, lack of passion, boredom" },
			{ name: "Two of Wands", upright: "Planning, making plans, discovery", reversed: "Lack of planning, lack of ambition" },
			{ name: "Three of Wands", upright: "Looking ahead, expansion, rapid growth", reversed: "Obstacles, delays, frustration" },
			{ name: "Four of Wands", upright: "Celebration, joy, harmony, relaxation", reversed: "Personal celebration, inner harmony, conflict with others" },
			{ name: "Five of Wands", upright: "Competition, rivalry, conflict", reversed: "Avoiding conflict, respecting differences" },
			{ name: "Six of Wands", upright: "Victory, success, public reward", reversed: "Excess pride, lack of recognition, punishment" },
			{ name: "Seven of Wands", upright: "Challenge, competition, protection", reversed: "Giving up, overwhelmed, overly protective" },
			{ name: "Eight of Wands", upright: "Rapid action, movement, quick decisions", reversed: "Panic, waiting, slowdown" },
			{ name: "Nine of Wands", upright: "Resilience, grit, last stand", reversed: "Exhaustion, fatigue, questioning motivations" },
			{ name: "Ten of Wands", upright: "Accomplishment, responsibility, burden", reversed: "Inability to delegate, overstressed, burnt out" },
			{ name: "Page of Wands", upright: "Exploration, excitement, freedom", reversed: "Lack of direction, procrastination, creating conflict" },
			{ name: "Knight of Wands", upright: "Action, adventure, fearlessness", reversed: "Anger, impulsiveness, recklessness" },
			{ name: "Queen of Wands", upright: "Courage, determination, joy", reversed: "Selfishness, jealousy, insecurities" },
			{ name: "King of Wands", upright: "Natural-born leader, vision, entrepreneur", reversed: "Impulsiveness, haste, ruthless, high expectations" },
		],
		cups: [
			{ name: "Ace of Cups", upright: "New feelings, spirituality, intuition", reversed: "Blocked emotions, self-love, disconnected feelings" },
			{ name: "Two of Cups", upright: "Unified love, partnership, mutual attraction", reversed: "Self-love, break-ups, disharmony, distrust" },
			{ name: "Three of Cups", upright: "Friendship, community, gatherings", reversed: "Overindulgence, gossip, isolation, third-party" },
			{ name: "Four of Cups", upright: "Meditation, contemplation, apathy, reevaluation", reversed: "Clarity, acceptance, choosing to engage" },
			{ name: "Five of Cups", upright: "Loss, grief, self-pity", reversed: "Acceptance, moving on, finding peace" },
			{ name: "Six of Cups", upright: "Revisiting the past, childhood memories, innocence", reversed: "Living in the past, forgiveness, naivety" },
			{ name: "Seven of Cups", upright: "Searching for purpose, choices, daydreaming", reversed: "Lack of purpose, diversion, confusion, wishful thinking" },
			{ name: "Eight of Cups", upright: "Walking away, disillusionment, leaving behind", reversed: "Avoidance, fear of change, fear of loss" },
			{ name: "Nine of Cups", upright: "Satisfaction, emotional stability, luxury", reversed: "Lack of inner joy, smugness, dissatisfaction" },
			{ name: "Ten of Cups", upright: "Divine love, blissful relationships, harmony, alignment", reversed: "Disconnection, misalignment of values, broken home" },
			{ name: "Page of Cups", upright: "Happy surprise, dreamer, sensitivity", reversed: "Emotional immaturity, insecurity, disappointment" },
			{ name: "Knight of Cups", upright: "Following the heart, idealist, romantic", reversed: "Moodiness, disappointment, emotionally immature" },
			{ name: "Queen of Cups", upright: "Compassionate, caring, emotionally stable", reversed: "Inner feelings, self-care, co-dependency" },
			{ name: "King of Cups", upright: "Emotional balance, compassion, diplomacy", reversed: "Emotional manipulation, moodiness, emotional abuse" },
		],
		swords: [
			{ name: "Ace of Swords", upright: "Breakthrough, clarity, sharp mind", reversed: "Confusion, brutality, chaos" },
			{ name: "Two of Swords", upright: "Difficult choices, indecision, stalemate", reversed: "Lesser of two evils, no right choice, confusion" },
			{ name: "Three of Swords", upright: "Heartbreak, emotional pain, sorrow, grief", reversed: "Recovery, forgiveness, moving on" },
			{ name: "Four of Swords", upright: "Rest, restoration, contemplation", reversed: "Restlessness, burnout, stress" },
			{ name: "Five of Swords", upright: "Unbridled ambition, win at all costs, sneakiness", reversed: "Resentment, desire to reconcile, forgiveness" },
			{ name: "Six of Swords", upright: "Transition, leaving behind, moving on", reversed: "Emotional baggage, unresolved issues, resisting transition" },
			{ name: "Seven of Swords", upright: "Deception, trickery, tactics and strategy", reversed: "Coming clean, rethinking approach, deception" },
			{ name: "Eight of Swords", upright: "Imprisonment, entrapment, self-victimization", reversed: "Self-acceptance, new perspective, freedom" },
			{ name: "Nine of Swords", upright: "Anxiety, worry, fear, depression, nightmares", reversed: "Hope, reaching out, despair, nightmares" },
			{ name: "Ten of Swords", upright: "Back-stabbed, betrayal, endings, loss", reversed: "Recovery, regeneration, resisting an inevitable end" },
			{ name: "Page of Swords", upright: "New ideas, curiosity, thirst for knowledge", reversed: "Deception, manipulation, all talk" },
			{ name: "Knight of Swords", upright: "Action, impulsiveness, defending beliefs", reversed: "No direction, disregard for consequences, unpredictability" },
			{ name: "Queen of Swords", upright: "Clear boundaries, direct communication, independence", reversed: "Cold hearted, cruel, bitterness" },
			{ name: "King of Swords", upright: "Mental clarity, intellectual power, authority", reversed: "Manipulation, tyrant, abusive, controlling" },
		],
		pentacles: [
			{ name: "Ace of Pentacles", upright: "New opportunity, resources, abundance", reversed: "Lost opportunity, lack of planning, bad investment" },
			{ name: "Two of Pentacles", upright: "Balancing decisions, priorities, adapting to change", reversed: "Loss of balance, disorganized, overwhelmed" },
			{ name: "Three of Pentacles", upright: "Teamwork, collaboration, learning", reversed: "Lack of teamwork, disorganized, group conflict" },
			{ name: "Four of Pentacles", upright: "Saving money, security, conservatism, scarcity", reversed: "Over-spending, greed, self-protection" },
			{ name: "Five of Pentacles", upright: "Need, poverty, insecurity, isolation", reversed: "Recovery, charity, poverty, isolation" },
			{ name: "Six of Pentacles", upright: "Charity, giving, prosperity, sharing wealth", reversed: "Strings attached, stinginess, power and domination" },
			{ name: "Seven of Pentacles", upright: "Long-term view, sustainable results, perseverance", reversed: "Lack of long-term vision, limited success or reward" },
			{ name: "Eight of Pentacles", upright: "Skill, talent, quality, high standards", reversed: "Self-development, perfectionism, lack of quality" },
			{ name: "Nine of Pentacles", upright: "Fruits of labor, rewards, luxury, self-sufficiency", reversed: "Overindulgence, reckless spending, false success" },
			{ name: "Ten of Pentacles", upright: "Wealth, financial security, family, long-term success", reversed: "Financial failure, lack of stability, family conflict" },
			{ name: "Page of Pentacles", upright: "Manifestation, financial opportunity, new job", reversed: "Lack of progress, procrastination, learn from failure" },
			{ name: "Knight of Pentacles", upright: "Efficiency, hard work, responsibility", reversed: "Laziness, obsessiveness, work without reward" },
			{ name: "Queen of Pentacles", upright: "Practicality, creature comforts, financial security", reversed: "Self-centeredness, jealousy, smothering" },
			{ name: "King of Pentacles", upright: "Wealth, business, security, discipline", reversed: "Financially irresponsible, obsessed with wealth and status" },
		],
	},
};

const zodiacSigns = [
	{
		name: "Aries",
		dates: "March 21 - April 19",
		element: "Fire",
		planet: "Mars",
		symbol: "♈",
		traits: "Bold, ambitious, confident, competitive",
	},
	{
		name: "Taurus",
		dates: "April 20 - May 20",
		element: "Earth",
		planet: "Venus",
		symbol: "♉",
		traits: "Stable, practical, sensual, determined",
	},
	{
		name: "Gemini",
		dates: "May 21 - June 20",
		element: "Air",
		planet: "Mercury",
		symbol: "♊",
		traits: "Curious, adaptable, communicative, versatile",
	},
	{
		name: "Cancer",
		dates: "June 21 - July 22",
		element: "Water",
		planet: "Moon",
		symbol: "♋",
		traits: "Intuitive, emotional, nurturing, protective",
	},
	{
		name: "Leo",
		dates: "July 23 - August 22",
		element: "Fire",
		planet: "Sun",
		symbol: "♌",
		traits: "Confident, creative, generous, passionate",
	},
	{
		name: "Virgo",
		dates: "August 23 - September 22",
		element: "Earth",
		planet: "Mercury",
		symbol: "♍",
		traits: "Analytical, practical, detail-oriented, perfectionist",
	},
	{
		name: "Libra",
		dates: "September 23 - October 22",
		element: "Air",
		planet: "Venus",
		symbol: "♎",
		traits: "Diplomatic, balanced, harmonious, aesthetic",
	},
	{
		name: "Scorpio",
		dates: "October 23 - November 21",
		element: "Water",
		planet: "Pluto",
		symbol: "♏",
		traits: "Intense, passionate, mysterious, transformative",
	},
	{
		name: "Sagittarius",
		dates: "November 22 - December 21",
		element: "Fire",
		planet: "Jupiter",
		symbol: "♐",
		traits: "Adventurous, optimistic, philosophical, freedom-loving",
	},
	{
		name: "Capricorn",
		dates: "December 22 - January 19",
		element: "Earth",
		planet: "Saturn",
		symbol: "♑",
		traits: "Ambitious, disciplined, responsible, practical",
	},
	{
		name: "Aquarius",
		dates: "January 20 - February 18",
		element: "Air",
		planet: "Uranus",
		symbol: "♒",
		traits: "Independent, innovative, humanitarian, intellectual",
	},
	{
		name: "Pisces",
		dates: "February 19 - March 20",
		element: "Water",
		planet: "Neptune",
		symbol: "♓",
		traits: "Intuitive, compassionate, artistic, dreamy",
	},
];

export default function GrimoirePage() {
	const itemListStructuredData = generateStructuredData({
		type: "ItemList",
		data: {
			name: "The Grimoire - Complete Astrology & Tarot Reference",
			description: "Comprehensive index of tarot cards, zodiac signs, and astrology knowledge",
			numberOfItems: 78 + 12, // 78 tarot cards + 12 zodiac signs
			itemListElement: [
				...tarotCards.majorArcana.map((card, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: card.name,
					description: `Tarot Card: ${card.upright}`,
				})),
				...zodiacSigns.map((sign, index) => ({
					"@type": "ListItem",
					position: 79 + index,
					name: sign.name,
					description: `${sign.element} sign ruled by ${sign.planet}`,
				})),
			],
		},
	});

	const faqStructuredData = generateStructuredData({
		type: "FAQPage",
		data: {
			mainEntity: [
				{
					"@type": "Question",
					name: "What does a reversed tarot card mean?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "A reversed tarot card typically indicates blocked energy, internal reflection, or a need to look inward. The meaning can be opposite to the upright position, represent internalization of the energy, or suggest delays. Each card has specific reversed meanings that provide deeper insight into your situation.",
					},
				},
				{
					"@type": "Question",
					name: "How do I calculate my birth chart?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "To calculate your birth chart (natal chart), you need your exact birth date, time, and location. The chart shows the positions of planets, sun, moon, and other celestial bodies at the moment of your birth. This reveals your zodiac sign, rising sign (ascendant), moon sign, and planetary aspects that influence your personality and life path.",
					},
				},
				{
					"@type": "Question",
					name: "What's the difference between sun sign and moon sign?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Your sun sign (zodiac sign) represents your core identity, ego, and conscious self - it's determined by your birth date. Your moon sign represents your emotional nature, inner self, and subconscious - it's determined by the moon's position at your birth. Both are important for understanding your complete astrological profile.",
					},
				},
				{
					"@type": "Question",
					name: "How often should I do a tarot reading?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "There's no set rule, but many readers recommend daily one-card draws for guidance, weekly three-card spreads for deeper insight, and monthly comprehensive readings for major life questions. Avoid over-reading the same question, as this can create confusion. Trust your intuition and let the cards guide you.",
					},
				},
				{
					"@type": "Question",
					name: "Which zodiac signs are most compatible?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Generally, signs of the same element (Fire: Aries, Leo, Sagittarius; Earth: Taurus, Virgo, Capricorn; Air: Gemini, Libra, Aquarius; Water: Cancer, Scorpio, Pisces) are compatible. However, compatibility depends on many factors including moon signs, rising signs, and planetary aspects. Opposites can also attract - like Aries and Libra, or Taurus and Scorpio.",
					},
				},
				{
					"@type": "Question",
					name: "What is a tarot spread and how do I use one?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "A tarot spread is a specific layout of cards, each position representing a different aspect of your question. Common spreads include the three-card spread (past, present, future), Celtic Cross (comprehensive 10-card reading), and one-card daily draws. Choose a spread that matches the depth of insight you're seeking.",
					},
				},
			],
		},
	});

	return (
		<main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
			/>
			<div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
				<Breadcrumbs
					items={[
						{ name: "Home", url: "/" },
						{ name: "The Grimoire", url: "/grimoire" },
					]}
				/>
				<div className="mb-8 md:mb-12">
					<h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
						The Grimoire
					</h1>
					<p className="text-lg md:text-xl text-gray-700 mb-2">
						Your Complete Reference Guide to Astrology, Tarot Cards, and Mystical Wisdom
					</p>
					<p className="text-gray-600 mb-4">
						Explore the most comprehensive index of tarot card meanings (including reversed cards), zodiac signs, astrology symbols, and spiritual knowledge. Whether you're a beginner seeking guidance or an experienced practitioner deepening your understanding, this grimoire serves as your ultimate spiritual reference.
					</p>
					<p className="text-gray-600">
						Discover detailed interpretations for all 78 tarot cards with both upright and reversed meanings, explore the 12 zodiac signs with their unique traits and characteristics, and learn about astrology fundamentals including birth charts, moon phases, and planetary influences.
					</p>
				</div>

				{/* Tarot Cards Section */}
				<section className="mb-12" id="tarot-cards">
					<h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
						Complete Tarot Card Reference
					</h2>
					<p className="text-gray-700 mb-8 text-lg">
						Discover the meanings of all 78 tarot cards, including upright and reversed interpretations. Each card holds profound wisdom and guidance for your spiritual journey.
					</p>

					{/* Major Arcana */}
					<div className="mb-10">
						<h3 className="text-2xl md:text-3xl font-semibold mb-6 text-indigo-700">
							Major Arcana (22 Cards)
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{tarotCards.majorArcana.map((card) => {
								const cardSlug = card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
								return (
									<Link
										key={card.number}
										href={`/grimoire/tarot/${cardSlug}`}
										className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all block"
									>
										<div className="flex items-center justify-between mb-3">
											<h4 className="text-xl font-bold text-gray-900">{card.name}</h4>
											<span className="text-sm text-gray-500">#{card.number}</span>
										</div>
										<p className="text-sm text-gray-600 mb-2">
											<strong>Element:</strong> {card.element}
										</p>
										<div className="mb-3">
											<p className="text-sm font-semibold text-green-700 mb-1">Upright:</p>
											<p className="text-sm text-gray-700 line-clamp-2">{card.upright}</p>
										</div>
										<div className="mb-3">
											<p className="text-sm font-semibold text-red-700 mb-1">Reversed:</p>
											<p className="text-sm text-gray-700 line-clamp-2">{card.reversed}</p>
										</div>
										<p className="text-xs text-indigo-600 mt-3 font-medium">View full meaning →</p>
									</Link>
								);
							})}
						</div>
					</div>

					{/* Minor Arcana - Wands */}
					<div className="mb-10">
						<h3 className="text-2xl md:text-3xl font-semibold mb-6 text-orange-700">
							Suit of Wands (14 Cards) - Fire Element
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{tarotCards.suits.wands.map((card) => {
								const cardSlug = card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
								return (
									<Link
										key={card.name}
										href={`/grimoire/tarot/${cardSlug}`}
										className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all block"
									>
										<h4 className="text-lg font-bold text-gray-900 mb-3">{card.name}</h4>
										<div className="mb-2">
											<p className="text-sm font-semibold text-green-700 mb-1">Upright:</p>
											<p className="text-sm text-gray-700 line-clamp-2">{card.upright}</p>
										</div>
										<div className="mb-3">
											<p className="text-sm font-semibold text-red-700 mb-1">Reversed:</p>
											<p className="text-sm text-gray-700 line-clamp-2">{card.reversed}</p>
										</div>
										<p className="text-xs text-orange-600 mt-3 font-medium">View full meaning →</p>
									</Link>
								);
							})}
						</div>
					</div>

					{/* Minor Arcana - Cups */}
					<div className="mb-10">
						<h3 className="text-2xl md:text-3xl font-semibold mb-6 text-blue-700">
							Suit of Cups (14 Cards) - Water Element
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{tarotCards.suits.cups.map((card) => {
								const cardSlug = card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
								return (
									<Link
										key={card.name}
										href={`/grimoire/tarot/${cardSlug}`}
										className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all block"
									>
										<h4 className="text-lg font-bold text-gray-900 mb-3">{card.name}</h4>
										<div className="mb-2">
											<p className="text-sm font-semibold text-green-700 mb-1">Upright:</p>
											<p className="text-sm text-gray-700 line-clamp-2">{card.upright}</p>
										</div>
										<div className="mb-3">
											<p className="text-sm font-semibold text-red-700 mb-1">Reversed:</p>
											<p className="text-sm text-gray-700 line-clamp-2">{card.reversed}</p>
										</div>
										<p className="text-xs text-blue-600 mt-3 font-medium">View full meaning →</p>
									</Link>
								);
							})}
						</div>
					</div>

					{/* Minor Arcana - Swords */}
					<div className="mb-10">
						<h3 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-700">
							Suit of Swords (14 Cards) - Air Element
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{tarotCards.suits.swords.map((card) => {
								const cardSlug = card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
								return (
									<Link
										key={card.name}
										href={`/grimoire/tarot/${cardSlug}`}
										className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg hover:border-gray-400 transition-all block"
									>
										<h4 className="text-lg font-bold text-gray-900 mb-3">{card.name}</h4>
										<div className="mb-2">
											<p className="text-sm font-semibold text-green-700 mb-1">Upright:</p>
											<p className="text-sm text-gray-700 line-clamp-2">{card.upright}</p>
										</div>
										<div className="mb-3">
											<p className="text-sm font-semibold text-red-700 mb-1">Reversed:</p>
											<p className="text-sm text-gray-700 line-clamp-2">{card.reversed}</p>
										</div>
										<p className="text-xs text-gray-600 mt-3 font-medium">View full meaning →</p>
									</Link>
								);
							})}
						</div>
					</div>

					{/* Minor Arcana - Pentacles */}
					<div className="mb-10">
						<h3 className="text-2xl md:text-3xl font-semibold mb-6 text-amber-700">
							Suit of Pentacles (14 Cards) - Earth Element
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{tarotCards.suits.pentacles.map((card) => {
								const cardSlug = card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
								return (
									<Link
										key={card.name}
										href={`/grimoire/tarot/${cardSlug}`}
										className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg hover:border-amber-300 transition-all block"
									>
										<h4 className="text-lg font-bold text-gray-900 mb-3">{card.name}</h4>
										<div className="mb-2">
											<p className="text-sm font-semibold text-green-700 mb-1">Upright:</p>
											<p className="text-sm text-gray-700 line-clamp-2">{card.upright}</p>
										</div>
										<div className="mb-3">
											<p className="text-sm font-semibold text-red-700 mb-1">Reversed:</p>
											<p className="text-sm text-gray-700 line-clamp-2">{card.reversed}</p>
										</div>
										<p className="text-xs text-amber-600 mt-3 font-medium">View full meaning →</p>
									</Link>
								);
							})}
						</div>
					</div>
				</section>

				{/* Zodiac Signs Section */}
				<section className="mb-12" id="zodiac-signs">
					<h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
						Zodiac Signs Reference
					</h2>
					<p className="text-gray-700 mb-8 text-lg">
						Explore all 12 zodiac signs, their elements, ruling planets, and key personality traits. Understand the cosmic influences that shape your character and destiny.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{zodiacSigns.map((sign) => {
							const signSlug = sign.name.toLowerCase();
							return (
								<Link
									key={sign.name}
									href={`/grimoire/zodiac/${signSlug}`}
									className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all block"
								>
									<div className="flex items-center justify-between mb-3">
										<h3 className="text-2xl font-bold text-gray-900">{sign.name}</h3>
										<span className="text-3xl">{sign.symbol}</span>
									</div>
									<p className="text-sm text-gray-600 mb-2">
										<strong>Dates:</strong> {sign.dates}
									</p>
									<p className="text-sm text-gray-600 mb-2">
										<strong>Element:</strong> {sign.element}
									</p>
									<p className="text-sm text-gray-600 mb-3">
										<strong>Ruling Planet:</strong> {sign.planet}
									</p>
									<p className="text-sm text-gray-700 mb-3">
										<strong>Traits:</strong> {sign.traits}
									</p>
									<p className="text-xs text-indigo-600 mt-3 font-medium">View full guide →</p>
								</Link>
							);
						})}
					</div>
				</section>

				{/* FAQ Section */}
				<section className="mb-12 bg-white rounded-lg p-8 shadow-md border border-gray-200" id="faq">
					<h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
						Frequently Asked Questions
					</h2>
					<div className="space-y-6">
						<div>
							<h3 className="text-xl font-semibold mb-2 text-indigo-700">
								What does a reversed tarot card mean?
							</h3>
							<p className="text-gray-700">
								A reversed tarot card typically indicates blocked energy, internal reflection, or a need to look inward. The meaning can be opposite to the upright position, represent internalization of the energy, or suggest delays. Each card has specific reversed meanings that provide deeper insight into your situation.
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2 text-indigo-700">
								How do I calculate my birth chart?
							</h3>
							<p className="text-gray-700">
								To calculate your birth chart (natal chart), you need your exact birth date, time, and location. The chart shows the positions of planets, sun, moon, and other celestial bodies at the moment of your birth. This reveals your zodiac sign, rising sign (ascendant), moon sign, and planetary aspects that influence your personality and life path.
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2 text-indigo-700">
								What's the difference between sun sign and moon sign?
							</h3>
							<p className="text-gray-700">
								Your sun sign (zodiac sign) represents your core identity, ego, and conscious self - it's determined by your birth date. Your moon sign represents your emotional nature, inner self, and subconscious - it's determined by the moon's position at your birth. Both are important for understanding your complete astrological profile.
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2 text-indigo-700">
								How often should I do a tarot reading?
							</h3>
							<p className="text-gray-700">
								There's no set rule, but many readers recommend daily one-card draws for guidance, weekly three-card spreads for deeper insight, and monthly comprehensive readings for major life questions. Avoid over-reading the same question, as this can create confusion. Trust your intuition and let the cards guide you.
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2 text-indigo-700">
								Which zodiac signs are most compatible?
							</h3>
							<p className="text-gray-700">
								Generally, signs of the same element (Fire: Aries, Leo, Sagittarius; Earth: Taurus, Virgo, Capricorn; Air: Gemini, Libra, Aquarius; Water: Cancer, Scorpio, Pisces) are compatible. However, compatibility depends on many factors including moon signs, rising signs, and planetary aspects. Opposites can also attract - like Aries and Libra, or Taurus and Scorpio.
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2 text-indigo-700">
								What is a tarot spread and how do I use one?
							</h3>
							<p className="text-gray-700">
								A tarot spread is a specific layout of cards, each position representing a different aspect of your question. Common spreads include the three-card spread (past, present, future), Celtic Cross (comprehensive 10-card reading), and one-card daily draws. Choose a spread that matches the depth of insight you're seeking.
							</p>
						</div>
					</div>
				</section>

				{/* Additional Resources */}
				<section className="mb-12 bg-white rounded-lg p-8 shadow-md border border-gray-200">
					<h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
						Additional Astrology Resources
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-xl font-semibold mb-3 text-indigo-700">Astrology Basics</h3>
							<ul className="space-y-2 text-gray-700">
								<li>• <Link href="/grimoire#zodiac-signs" className="text-indigo-600 hover:underline">Birth Chart Interpretation</Link></li>
								<li>• Planetary Aspects & Transits</li>
								<li>• Astrology Houses Explained</li>
								<li>• Moon Phases & Their Meanings</li>
								<li>• Rising Signs (Ascendant)</li>
								<li>• <Link href="/grimoire#zodiac-signs" className="text-indigo-600 hover:underline">Compatibility Analysis</Link></li>
							</ul>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-3 text-purple-700">Tarot Reading</h3>
							<ul className="space-y-2 text-gray-700">
								<li>• Common Tarot Spreads</li>
								<li>• <Link href="/grimoire#tarot-cards" className="text-purple-600 hover:underline">How to Read Reversed Cards</Link></li>
								<li>• Card Combinations</li>
								<li>• Intuitive Reading Techniques</li>
								<li>• Daily Card Draws</li>
								<li>• Love & Relationship Spreads</li>
							</ul>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
