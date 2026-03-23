import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | CraftMyPage',
  description: 'Terms of Service for CraftMyPage website builder and hosting.',
}

export default function TermsPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
          Terms of service
        </h1>
        <p className="mt-2 text-sm text-neutral-400">Last updated: 18 March 2026</p>

        <div className="mt-10 prose prose-neutral max-w-none prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-neutral-600 prose-li:text-neutral-600 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline">
          <h2>1. About these terms</h2>
          <p>
            These terms of service (&quot;Terms&quot;) govern your use of the CraftMyPage website builder and hosting platform (&quot;Service&quot;) operated by CraftMyPage (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By creating an account or using the Service, you agree to be bound by these Terms.
          </p>

          <h2>2. Accounts</h2>
          <p>
            You must provide accurate information when creating an account. You are responsible for keeping your login credentials secure and for all activity under your account. You must be at least 18 years old to use the Service.
          </p>

          <h2>3. Subscriptions and billing</h2>
          <ul>
            <li>Free accounts can generate and preview sites but cannot publish them.</li>
            <li>Paid plans (Starter, Pro) are billed monthly or yearly as selected at checkout.</li>
            <li>Prices are in GBP and include VAT where applicable.</li>
            <li>Subscriptions renew automatically. You can cancel at any time from your dashboard.</li>
            <li>When you cancel, your site stays live until the end of the current billing period, then moves to a suspended state.</li>
          </ul>

          <h2>4. 30-day money-back guarantee</h2>
          <p>
            If you are unhappy with the Service, you may request a full refund within 30 days of your initial subscription purchase. Refunds are processed automatically. After the 30-day window, no refunds are available, but you may cancel at any time to prevent future charges.
          </p>

          <h2>5. Add-ons</h2>
          <ul>
            <li><strong>Custom domains</strong> are purchased through us via Cloudflare Registrar. Domain registrations are non-refundable once completed. Renewal pricing may change based on registry costs.</li>
            <li><strong>Branding removal</strong> is a monthly add-on. Cancelling it restores the CraftMyPage footer badge.</li>
          </ul>

          <h2>6. Your content</h2>
          <p>
            You retain ownership of all content you upload or enter into the Service. By publishing a site, you grant us a licence to host, serve, and cache your content as needed to deliver the Service.
          </p>

          <h2>7. Acceptable use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Publish content that infringes copyright, trademarks, or other intellectual property rights.</li>
            <li>Use logos, brand names, or images you do not have permission to use.</li>
            <li>Publish illegal, defamatory, abusive, or hateful content.</li>
            <li>Distribute malware, phishing pages, or deceptive content.</li>
            <li>Send spam or bulk unsolicited messages via contact forms.</li>
            <li>Attempt to access other users' accounts or data.</li>
            <li>Use the Service to build sites that impersonate other businesses or individuals.</li>
          </ul>
          <p>
            We reserve the right to suspend or remove any site that violates these terms without notice.
          </p>

          <h2>8. Intellectual property</h2>
          <p>
            The CraftMyPage platform, templates, and generated code are our intellectual property. Your subscription grants you a licence to use generated sites for your business. You may not resell, redistribute, or sublicence the templates or platform code.
          </p>

          <h2>9. Service availability</h2>
          <p>
            We aim for high uptime but do not guarantee uninterrupted service. Sites are hosted on Cloudflare infrastructure. We are not liable for downtime caused by third-party providers, maintenance windows, or events outside our control.
          </p>

          <h2>10. Data and privacy</h2>
          <p>
            We collect and process personal data as described in our{' '}
            <Link href="/privacy">Privacy policy</Link>. Contact form submissions on your published sites are stored securely and accessible from your dashboard.
          </p>

          <h2>11. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, CraftMyPage is not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you have paid us in the 12 months preceding any claim.
          </p>

          <h2>12. Termination</h2>
          <p>
            You may close your account at any time. We may suspend or terminate your account if you breach these Terms. On termination, your published sites will be taken offline. We may retain anonymised usage data for analytics purposes.
          </p>

          <h2>13. Changes to these terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be communicated via email or a notice on the platform. Continued use of the Service after changes constitutes acceptance.
          </p>

          <h2>14. Governing law</h2>
          <p>
            These Terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2>15. Contact</h2>
          <p>
            Questions about these terms? Email us at{' '}
            <a href="mailto:hello@craftmypage.com">hello@craftmypage.com</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
