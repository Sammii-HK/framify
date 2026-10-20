# Spotless, cleaning company website template

A bright, high-converting website for home cleaning, end-of-tenancy and office cleaning businesses. The centrepiece is an instant price estimate above the fold, so visitors see a price in 30 seconds and book while they are still keen.

## What's in the box

- `index.html`: the one-page site (instant estimate, services, what's included, how it works, areas, reviews, guarantee, FAQ, booking form).
- `thank-you.html`: shown after someone sends the booking form.
- `privacy.html`: a privacy notice to adapt (UK GDPR wording).
- `404.html`: page-not-found.
- `styles.css`, `main.js`: styling and shared behaviour.
- `estimator.js`: **your prices** live here, plus the room tabs and postcode checker.
- `assets/favicon.svg`: swap for your own.

## Quick start (10 minutes)

1. **Unzip** and open `index.html` in your browser to see the site.
2. **Edit the words.** Open `index.html` in any text editor (VS Code is free). Every place you need to change is marked with an `EDIT:` comment. Search for `EDIT` to find them all.
3. **Pick a colour palette.** Change `data-palette` on the `<html>` tag at the top of each page. Options: `fresh` (default), `sky`, `citrus`.
4. **Light and dark mode** work automatically. The site follows the visitor's system setting, and the sun/moon button lets them switch. Their choice is remembered.
5. **Connect the form** (see below), then **publish** (see below).

## Connect the contact form

The form posts to any form service. The simplest free options:

- **Formspree**: create a form at formspree.io, copy your form ID and replace `YOUR_FORM_ID` in the form's `action`.
- **Basin** (usebasin.com) or **Getform**: same idea, paste their endpoint into `action`.
- **Netlify Forms**: if you host on Netlify, add `data-netlify="true"` to the `<form>` and change `action` to `thank-you.html`.

Until you do this, the form shows a friendly "not connected yet" message instead of losing enquiries.

## Publish it (free)

Drag the whole folder into any of these and you get a live site with HTTPS:

- **Netlify Drop** (app.netlify.com/drop): no account needed to try it.
- **Cloudflare Pages**, **Vercel** or **GitHub Pages**: free, fast, and you can connect your own domain.

Rather not deal with hosting? **CraftMyPage** can host it on your own domain for you: craftmypage.com.

## Fonts and privacy

Fonts load from Google Fonts for convenience. If you'd rather not send visitors' IP addresses to Google (some EU businesses prefer this), download the fonts from fonts.google.com, put the `.woff2` files in `assets/fonts/`, add `@font-face` rules at the top of `styles.css`, and delete the Google Fonts `<link>` lines. The template has no cookies, analytics or trackers.

## Accessibility

Built to WCAG 2.1 AA and checked with axe-core in every palette, in light and dark, on desktop and mobile:

- Colour contrast meets AA throughout; keep it that way if you change colours (webaim.org/resources/contrastchecker).
- Skip link, landmarks, visible focus styles and full keyboard support.
- Motion respects "reduce motion" settings.
- Form fields have labels, errors are announced to screen readers.

## Browser support

Current Chrome, Edge, Safari and Firefox, on desktop and mobile. No build tools, frameworks or dependencies.

## Set your prices

Open `estimator.js`. Everything is in the `PRICING` block at the top:

```js
hourlyRate: 24,      // what you charge per cleaner-hour
minimumCharge: 60,   // smallest booking you take
services: { regular: { base: 2, perBedroom: 0.5, perBathroom: 0.5 }, ... },
frequencyDiscount: { weekly: 0.1, fortnightly: 0.05, once: 0 },
extras: { oven: { label: 'inside oven', price: 35 }, ... }
```

The estimate shows a range (plus or minus 7% by default) so it reads as an estimate, not a binding quote. When a visitor presses **Book this clean**, their estimate is copied into the booking form so you see exactly what they were shown. Also update the "From £" prices on the service cards to match.

## Areas you cover

Edit the postcode chips in the Areas section. The checker reads that same list, so there's only one place to change. It works with full postcodes, with or without a space.

## Reviews: real ones only

The three reviews are examples and are labelled as such. Replace them with real reviews (copy them from Google with the customer's first name and area) and delete the "Example reviews shown" line. Writing or buying fake reviews is illegal in the UK under the Digital Markets, Competition and Consumers Act 2024, and in the US under the FTC's rule on fake reviews.

## Trust details

Update the footer with your company number and insurance, and only keep claims you can back up ("vetted", "insured", "eco products", "24-hour re-clean guarantee"). The **Schema markup** (`HouseCleaningService`) in the `<head>` lists your areas and hours for Google. Update it too.

## Need help?

Email hello@craftmypage.com with your order number. Free fixes for any bug in the template, for life.

## Changelog

- **1.0.0** (October 2026): first release.
