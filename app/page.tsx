'use client'

import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Home() {
  const { user } = useUser()

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      {/* Hero Section - AI Guide Front and Center */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              ✨ Powered by AI
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Your personal AI-powered cosmic guide
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Personalised daily insights, tarot interpretation, emotional patterns, and birth chart analysis — all based on <span className="font-semibold text-purple-600">you</span>.
          </p>
          <Link
            href={user ? '/dashboard' : '/auth/login'}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Meet Your Astral Guide →
          </Link>
        </div>
      </section>

      {/* Social Proof / Authority */}
      <section className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-2">
            Trusted by thousands of cosmic seekers
          </p>
          <p className="text-gray-500 text-sm">
            Backed by advanced astrology + AI models
          </p>
        </div>
      </section>

      {/* Value Proposition - Tightened */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            More than just horoscopes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lunary combines AI, tarot, astrology, and your personal patterns to deliver insights that actually matter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">AI Astral Guide</h3>
            <p className="text-gray-600">
              Your personal AI that knows your chart, emotions, tarot patterns, and cosmic cycles.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🃏</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Tarot Pattern Recognition</h3>
            <p className="text-gray-600">
              See how tarot cards reflect your emotional cycles and life patterns over time.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Book of Shadows</h3>
            <p className="text-gray-600">
              Track your moods, rituals, reflections, and cosmic insights in your personal grimoire.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Ritual Generation</h3>
            <p className="text-gray-600">
              Get personalised rituals based on lunar phases, your chart, and current energies.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📧</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Weekly Cosmic Newsletters</h3>
            <p className="text-gray-600">
              Receive personalised weekly insights delivered to your inbox.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Crystal Recommendations</h3>
            <p className="text-gray-600">
              Discover crystals aligned with your birth chart and current energies.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Shareable Visuals</h3>
            <p className="text-gray-600">
              Beautiful, custom OG images and cosmic visuals to share your insights.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🌙</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Birth Chart Insights</h3>
            <p className="text-gray-600">
              Deep, personalised analysis of your natal chart, not generic interpretations.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">A Real Personality</h3>
            <p className="text-gray-600">
              Built by a real practitioner, not a corporation. Lunary has soul.
            </p>
          </div>
        </div>
      </section>

      {/* Outcome-Based Features */}
      <section className="bg-white/60 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What you'll experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Understand today's energy based on your birth chart
                </h3>
                <p className="text-gray-600">
                  Not generic horoscopes — insights tailored to your unique astrological makeup.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  See tarot patterns that reflect your emotional cycles
                </h3>
                <p className="text-gray-600">
                  Discover how the cards mirror your inner world and life patterns.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-xl">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Let your AI guide interpret cosmic events for you
                </h3>
                <p className="text-gray-600">
                  Understand how retrogrades, eclipses, and transits affect you personally.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Track your moods, rituals, and reflections in your Book of Shadows
                </h3>
                <p className="text-gray-600">
                  Build a living record of your spiritual journey and cosmic insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Lunary Section */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Why Lunary is Different
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Personal AI astral guide</h3>
                  <p className="text-purple-100 text-sm">Not chatbots — a guide that learns you.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Deeply personalised readings</h3>
                  <p className="text-purple-100 text-sm">Based on your chart, not generic sun signs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔮</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Tarot + astrology + emotions combined</h3>
                  <p className="text-purple-100 text-sm">The only app that connects all three.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Living Book of Shadows</h3>
                  <p className="text-purple-100 text-sm">Your personal grimoire that grows with you.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Cosmic visuals and custom OG images</h3>
                  <p className="text-purple-100 text-sm">Beautiful shareable content for your insights.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Daily + weekly + monthly personalised cycles</h3>
                  <p className="text-purple-100 text-sm">Insights at every time scale.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <span className="text-2xl">💜</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Built by a real practitioner, not a corporation</h3>
                  <p className="text-purple-100 text-sm">Lunary has soul, authenticity, and genuine understanding of the craft.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Preview */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What you'll get after signup
            </h2>
            <p className="text-lg text-gray-600">
              See what's waiting for you inside Lunary
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Personalised Horoscope</h3>
              <p className="text-gray-600 text-sm">
                Daily insights tailored to your birth chart, not generic sun sign readings.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">AI Chat Interface</h3>
              <p className="text-gray-600 text-sm">
                Ask your astral guide anything about your chart, emotions, or cosmic events.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🃏</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Tarot Pattern Summary</h3>
              <p className="text-gray-600 text-sm">
                Visual overview of how tarot cards reflect your emotional cycles.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Book of Shadows Entry</h3>
              <p className="text-gray-600 text-sm">
                Beautiful interface for tracking rituals, moods, and reflections.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🌙</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Lunar Rituals</h3>
              <p className="text-gray-600 text-sm">
                Personalised rituals based on moon phases and your chart.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="aspect-video bg-gradient-to-br from-pink-100 to-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Birth Chart Analysis</h3>
              <p className="text-gray-600 text-sm">
                Deep dive into your natal chart with AI-powered interpretations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tease */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start exploring for free
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Upgrade only if you want deeper, personalised insights.
          </p>
          <Link
            href={user ? '/dashboard' : '/auth/login'}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Begin Your Cosmic Journey
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to meet your AI astral guide?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands discovering personalised cosmic insights.
          </p>
          <Link
            href={user ? '/dashboard' : '/auth/login'}
            className="inline-block px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Started Free →
          </Link>
        </div>
      </section>
    </main>
  )
}
