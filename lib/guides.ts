/**
 * Search guides: one useful, specific page per niche a template serves. Each answers what people
 * search before they buy a site ("what to put on a therapist website") and links to the template
 * that already does it. Facts only; no invented statistics or reviews.
 */

export interface GuideSection {
  heading: string
  paragraphs?: string[]
  list?: string[]
}

export interface Guide {
  slug: string
  title: string
  /** <title> tag; keep under ~60 characters */
  seoTitle: string
  description: string
  updated: string // ISO date
  template: string // template type in template-data.ts
  intro: string[]
  sections: GuideSection[]
  faq: { q: string; a: string }[]
}

export const guides: Guide[] = [
  {
    slug: 'app-store-support-url-privacy-policy',
    title: 'App Store support URL and privacy policy: what Apple requires',
    seoTitle: 'App Store Support URL and Privacy Policy Requirements',
    description:
      'What App Store Connect needs for the Support URL, Privacy Policy URL and Terms of Use, what each page must say, and the rejections that come from getting them wrong.',
    updated: '2026-10-21',
    template: 'app-launch',
    intro: [
      'Every app you submit to the App Store needs a few public web pages before it can go to review. They are easy to forget until App Store Connect refuses to save without them, usually the night before you submit.',
      'This guide covers what each URL is for, what Apple expects the page to say, and how to avoid the rejections that come from thin or missing pages.',
    ],
    sections: [
      {
        heading: 'The URLs App Store Connect asks for',
        list: [
          'Support URL: required for every app, on the version page. It must lead to a way to contact you.',
          'Privacy Policy URL: required for every app, on the App Privacy page. The same policy must also be reachable inside the app.',
          'Marketing URL: optional. A landing page for the app.',
          'Terms of Use (EULA): required in practice for apps that sell auto-renewable subscriptions. You can use Apple’s standard EULA, but the listing and the purchase screen still need a link to it.',
        ],
      },
      {
        heading: 'What the Support page needs',
        paragraphs: [
          'Guideline 1.5 asks that your app and its Support URL include an easy way to contact you. A page that only says “Thanks for using our app” is not enough.',
        ],
        list: [
          'A real contact route: an email address or a contact form that works.',
          'A short FAQ for the questions people actually ask: restoring purchases, cancelling a subscription, syncing between devices.',
          'How to cancel a subscription. Apple handles billing, so point people to their Apple ID subscription settings.',
          'The app’s name and your name or company, so a reviewer can see the page belongs to the app.',
        ],
      },
      {
        heading: 'What the Privacy Policy must cover',
        paragraphs: [
          'Guideline 5.1.1(i) sets out what the policy has to say. A generic policy copied from another site usually misses at least one of these, and a mismatch with your App Privacy label is a common reason for rejection.',
        ],
        list: [
          'What data the app collects, and how it collects it.',
          'Every use of that data.',
          'Which third parties receive it (analytics, crash reporting, payments, AI providers), and that they protect it to the same standard.',
          'How long you keep data, and how someone can ask for it to be deleted.',
          'How someone can withdraw consent.',
        ],
      },
      {
        heading: 'Rejections these pages cause',
        list: [
          '1.5: the Support URL has no way to contact you, or does not load.',
          '5.1.1(i): the privacy policy link is missing, broken, or not reachable inside the app.',
          '3.1.2: a subscription app has no Terms of Use link in the listing or on the paywall.',
          'Mismatch: the policy says you collect nothing, but the App Privacy label (or an SDK) says otherwise.',
        ],
      },
      {
        heading: 'A quick way to get all three',
        paragraphs: [
          'Host three plain pages on one domain: a landing page, /support and /privacy. Static HTML on a free host is fine; App Review checks that the pages load and say the right things, not how they are built.',
          'Launchpad ships exactly that: a launch page plus Support and Privacy Policy pages written for App Store Connect, in light and dark mode, ready to edit in any text editor.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can my Support URL be a mailto link?',
        a: 'App Store Connect expects a web URL. Use a page that shows your email address or a contact form.',
      },
      {
        q: 'Does a free app with no accounts still need a privacy policy?',
        a: 'Yes. Every app needs a Privacy Policy URL, even one that collects no data. In that case the policy says so plainly.',
      },
      {
        q: 'Can the support and privacy pages be on the same site as my landing page?',
        a: 'Yes. One domain with /support and /privacy pages is the usual setup.',
      },
    ],
  },
  {
    slug: 'app-landing-page-checklist',
    title: 'What to put on an app landing page: a checklist',
    seoTitle: 'App Landing Page Checklist: What to Include',
    description:
      'A practical checklist for an iPhone or Android app landing page: the one-line pitch, screenshots, the App Store badge, pricing, and the support and privacy links reviewers look for.',
    updated: '2026-10-21',
    template: 'app-launch',
    intro: [
      'An app landing page has one job: help the right person decide to tap the download button. Most of the work is cutting things out.',
      'Here is what earns its place, in roughly the order people read it.',
    ],
    sections: [
      {
        heading: 'Above the fold',
        list: [
          'One sentence saying what the app does and who it is for. Not a slogan.',
          'The official App Store badge (and Google Play, if you ship there). Apple publishes the badge artwork and rules for using it.',
          'One real screenshot in a phone frame, showing the app doing its main job.',
        ],
      },
      {
        heading: 'Below it',
        list: [
          'Three features at most, each tied to a result (“See your week at a glance”, not “Powerful calendar engine”).',
          'More screenshots, each with a short caption.',
          'Pricing in plain words: free, free with a subscription, or paid up front. If there is a trial, say how long it lasts and what it costs afterwards.',
          'Quotes or ratings only if they are real and you can link to them.',
          'A short FAQ: devices supported, data and sync, how to cancel.',
        ],
      },
      {
        heading: 'Footer links reviewers and users look for',
        list: [
          'Support page with a working contact route.',
          'Privacy policy.',
          'Terms of Use, if you sell subscriptions.',
          'Your name or company.',
        ],
      },
      {
        heading: 'Small technical wins',
        list: [
          'Add the apple-itunes-app meta tag so Safari on iPhone shows a Smart App Banner that opens or installs your app.',
          'Give the page its own title, description and social image, so links shared on X, LinkedIn or iMessage look right.',
          'Support dark mode; a lot of iPhone users run it all day.',
          'Keep it fast: compressed screenshots, no heavy tracking scripts.',
        ],
      },
    ],
    faq: [
      {
        q: 'Do I need a landing page if I am already on the App Store?',
        a: 'It helps. It gives you a link to share that works on desktop, a home for your Support and Privacy pages, and a page that search engines can index.',
      },
      {
        q: 'Should the landing page have a waitlist?',
        a: 'Only before launch. Once the app is live, the main button should be the store badge.',
      },
    ],
  },
  {
    slug: 'therapist-website-checklist',
    title: 'What to put on a therapist website: a checklist',
    seoTitle: 'Therapist Website Checklist: What to Include (UK)',
    description:
      'What a counsellor or therapist website needs so the right clients get in touch: who you help, your approach, fees, qualifications, what the first session is like, confidentiality and booking.',
    updated: '2026-10-21',
    template: 'therapist',
    intro: [
      'People looking for a therapist are often reading your site at a hard moment. They want to know three things quickly: can you help with what I am going through, what is it like to work with you, and how do I take the first step.',
      'This checklist is written with UK private practice in mind, but most of it applies anywhere.',
    ],
    sections: [
      {
        heading: 'Who you help and how',
        list: [
          'Who you work with (adults, couples, young people) and the issues you see most, in plain language.',
          'Your approach (for example person-centred, CBT, psychodynamic, integrative) and what that means in practice for a client.',
          'Whether you offer sessions in person, online, by phone, or a mix, and where you are based.',
        ],
      },
      {
        heading: 'Trust and credentials',
        list: [
          'Your qualifications and your professional body membership, such as BACP, UKCP or, for psychologists, HCPC registration. Link to your register entry if there is one.',
          'A short, warm “about me” with a real photo.',
          'Confidentiality: what it means and its limits, in a sentence or two.',
        ],
      },
      {
        heading: 'Practical details',
        list: [
          'Fees, session length and how often people usually come. Mention any concessions or a free first call.',
          'What happens at the first session, step by step.',
          'Your availability, roughly (for example weekday evenings).',
          'Your cancellation policy.',
        ],
      },
      {
        heading: 'Getting in touch',
        list: [
          'One clear way to book or ask a question: a short form, an email address or a booking link.',
          'A line saying you are not an emergency service, with crisis contacts such as Samaritans (116 123 in the UK and Ireland).',
          'A privacy notice. Enquiries can contain health information, which UK GDPR treats as special category data, so say how you store and protect it.',
        ],
      },
      {
        heading: 'Design that helps',
        paragraphs: [
          'Calm colours, plenty of space, readable text and nothing that flashes. Make it work well on a phone, and make it accessible: many people browse with larger text or a screen reader.',
          'Haven is a one-page therapist site built around this checklist, with fees, what to expect and a gentle booking form, in light and dark mode.',
        ],
      },
    ],
    faq: [
      {
        q: 'Should I list my fees on my website?',
        a: 'Most clients prefer to see them. It saves an awkward first conversation and filters out enquiries that will not go ahead.',
      },
      {
        q: 'Can I use client testimonials?',
        a: 'Professional bodies generally advise caution with testimonials in therapy because of confidentiality. Check your body’s ethical framework before adding any.',
      },
    ],
  },
  {
    slug: 'cleaning-business-website-checklist',
    title: 'What to put on a cleaning business website',
    seoTitle: 'Cleaning Business Website: What to Include',
    description:
      'A checklist for a cleaning company website that turns visitors into bookings: services, areas covered, prices or an instant estimate, insurance, what is included, and a quick quote form.',
    updated: '2026-10-21',
    template: 'cleaning',
    intro: [
      'Most people who land on a cleaning company’s site want an answer to “do you cover my area, and roughly what will it cost?” The faster your site answers that, the more enquiries you get.',
    ],
    sections: [
      {
        heading: 'Answer the first two questions',
        list: [
          'The areas or postcodes you cover, near the top of the page.',
          'Prices, or at least a starting price per visit or per hour. An instant estimate (bedrooms, bathrooms, extras) works even better.',
        ],
      },
      {
        heading: 'Services, clearly separated',
        list: [
          'Regular home cleaning, deep cleans, end-of-tenancy, office cleaning: whichever you actually offer.',
          'What is included in each, room by room. People compare these lists.',
          'What is not included, so there are no surprises.',
        ],
      },
      {
        heading: 'Trust',
        list: [
          'Insurance: say that you hold public liability insurance, if you do.',
          'Vetting: if your cleaners are DBS checked, say so.',
          'Who supplies products and equipment, and whether you can use eco products.',
          'Reviews, only real ones, with a link to where they were left.',
        ],
      },
      {
        heading: 'Booking',
        list: [
          'A short quote form: postcode, property size, type of clean, preferred day.',
          'A phone number that is answered, or clear response times.',
          'An FAQ: keys and access, pets, cancellations, what happens if something is missed.',
        ],
      },
      {
        heading: 'A site that does this already',
        paragraphs: [
          'Spotless is a cleaning company template with an instant price estimate, a room-by-room checklist and a postcode checker, in light and dark mode.',
        ],
      },
    ],
    faq: [
      {
        q: 'Should a cleaning company show prices online?',
        a: 'Yes, even if only as “from” prices. Visitors who cannot find a price often leave without asking.',
      },
      {
        q: 'What pages does a cleaning website need?',
        a: 'For a small company, one well-organised page is enough: services, areas, prices, trust details, FAQ and a quote form.',
      },
    ],
  },
  {
    slug: 'small-business-website-without-a-designer',
    title: 'How to make a website for your small business without a designer',
    seoTitle: 'Small Business Website Without a Designer: A Guide',
    description:
      'A plain guide to getting a good small business website live yourself: what pages you need, what to write, domains, and when a template or a site builder is the right choice.',
    updated: '2026-10-21',
    template: 'standard',
    intro: [
      'A small business website does not need to be big. It needs to tell the right people what you do, where, for how much, and how to get in touch, and it needs to work well on a phone.',
    ],
    sections: [
      {
        heading: 'What to put on it',
        list: [
          'What you do and where, in one sentence at the top.',
          'Your main services, each with a short description and a starting price if you can.',
          'Proof you are real: photos of your work, qualifications, insurance, genuine reviews.',
          'Opening hours or availability.',
          'One clear way to get in touch: phone, email or a short form.',
          'A privacy notice if your form collects personal details.',
        ],
      },
      {
        heading: 'Your options',
        list: [
          'A site builder: you fill in your details, it handles hosting. Quickest, with a monthly fee.',
          'A ready-made template: pay once, edit the HTML, host it free on a static host. Cheapest over time, but you edit files yourself.',
          'A designer or developer: best when you need something unusual, and the most expensive.',
        ],
      },
      {
        heading: 'Domains',
        paragraphs: [
          'A domain like yourbusiness.co.uk looks more established than a subdomain. Pick something short and easy to say out loud, and set up an email address on it.',
        ],
      },
      {
        heading: 'After it is live',
        list: [
          'Add the site to your Google Business Profile.',
          'Link to it from your social profiles and email signature.',
          'Check it on your own phone, then ask a friend to find your prices and contact details without help.',
        ],
      },
      {
        heading: 'With CraftMyPage',
        paragraphs: [
          'CraftMyPage does the site builder route: choose a layout for your kind of business, fill in your details and preview it free, then subscribe when you are ready to publish. You can connect your own domain. If you would rather own the files, every template can also be bought as HTML.',
        ],
      },
    ],
    faq: [
      {
        q: 'How many pages does a small business website need?',
        a: 'For most local businesses, one well-organised page is enough. Add pages when you have enough content for them, such as a separate page per service.',
      },
      {
        q: 'Do I need to know how to code?',
        a: 'Not with a site builder. With an HTML template you will edit text in files, which is closer to editing a document than programming.',
      },
    ],
  },
]

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}

export function guidesForTemplate(type: string): Guide[] {
  return guides.filter((g) => g.template === type)
}
