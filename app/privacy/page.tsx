import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | CraftMyPage',
  description: 'Privacy policy for CraftMyPage website builder and hosting.',
}

export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
          Privacy policy
        </h1>
        <p className="mt-2 text-sm text-neutral-400">Last updated: 18 March 2026</p>

        <div className="mt-10 prose prose-neutral max-w-none prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-neutral-600 prose-li:text-neutral-600 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline">
          <h2>1. What we collect</h2>
          <ul>
            <li><strong>Account data:</strong> email address, name (from Auth0 login).</li>
            <li><strong>Site content:</strong> business information, images, and text you enter when building your site.</li>
            <li><strong>Contact form submissions:</strong> messages visitors send via your published site's contact form.</li>
            <li><strong>Payment data:</strong> processed by Stripe. We do not store card numbers.</li>
            <li><strong>Usage analytics:</strong> page views and basic analytics via Cloudflare Web Analytics (cookieless, privacy-friendly).</li>
          </ul>

          <h2>2. How we use your data</h2>
          <ul>
            <li>To provide and improve the Service.</li>
            <li>To process payments and manage subscriptions.</li>
            <li>To send transactional emails (account confirmations, billing receipts).</li>
            <li>To respond to support requests.</li>
          </ul>
          <p>We do not sell your personal data to third parties.</p>

          <h2>3. Third-party services</h2>
          <p>We use the following services to operate the platform:</p>
          <ul>
            <li><strong>Auth0</strong> for authentication.</li>
            <li><strong>Stripe</strong> for payment processing.</li>
            <li><strong>Cloudflare</strong> for hosting, DNS, domain registration, and analytics.</li>
            <li><strong>Neon</strong> for database hosting.</li>
            <li><strong>Vercel</strong> for application hosting.</li>
            <li><strong>OpenAI</strong> for AI-assisted content generation.</li>
            <li><strong>Unsplash</strong> for stock images.</li>
          </ul>
          <p>Each provider has its own privacy policy and processes data according to their terms.</p>

          <h2>4. Data retention</h2>
          <p>
            Account and site data is retained while your account is active. After account deletion, we remove your personal data within 30 days. Anonymised analytics data may be retained indefinitely.
          </p>

          <h2>5. Your rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data.</li>
            <li>Export your data in a portable format.</li>
            <li>Object to processing of your data.</li>
          </ul>
          <p>
            To exercise any of these rights, email{' '}
            <a href="mailto:hello@craftmypage.com">hello@craftmypage.com</a>.
          </p>

          <h2>6. Cookies</h2>
          <p>
            We use essential cookies for authentication sessions. We do not use tracking cookies or advertising pixels. Cloudflare Web Analytics is cookieless.
          </p>

          <h2>7. Children</h2>
          <p>
            The Service is not intended for anyone under 18. We do not knowingly collect data from children.
          </p>

          <h2>8. Changes</h2>
          <p>
            We may update this policy from time to time. Material changes will be communicated via email.
          </p>

          <h2>9. Contact</h2>
          <p>
            For privacy enquiries, email us at{' '}
            <a href="mailto:hello@craftmypage.com">hello@craftmypage.com</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
