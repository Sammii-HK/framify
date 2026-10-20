# Haven, therapist & counsellor website template

A calm, trustworthy one-page website for therapists, counsellors, psychotherapists and coaches in private practice. Designed around what people actually need to decide whether to book a first call: who you help, how you work, what it costs and what happens next.

## What's in the box

- `index.html`: the one-page site (hero, who it's for, approach, about, what to expect, fees, FAQ, contact).
- `thank-you.html`: shown after someone sends the form.
- `privacy.html`: a privacy notice to adapt (UK GDPR wording).
- `404.html`: page-not-found.
- `styles.css`, `main.js`: all styling and the small amount of JavaScript.
- `assets/favicon.svg`: swap for your own.

## Quick start (10 minutes)

1. **Unzip** and open `index.html` in your browser to see the site.
2. **Edit the words.** Open `index.html` in any text editor (VS Code is free). Every place you need to change is marked with an `EDIT:` comment. Search for `EDIT` to find them all.
3. **Pick a colour palette.** Change `data-palette` on the `<html>` tag at the top of each page. Options: `sage` (default), `clay`, `dusk`.
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

## Written for therapy, not adapted from a business template

- **No testimonials, on purpose.** Many professional bodies restrict asking clients for testimonials (for example, the APA Ethics Code, standard 5.05). Haven builds trust with a clear approach, credentials and fees instead. Check your own body's advertising guidance before adding any.
- **"Check my registration" link.** Point it at your entry on your professional body's public register. It's one of the strongest trust signals you can give.
- **Crisis signposting** in the footer, because people sometimes find a therapist's site at a bad moment. The numbers are UK (999, Samaritans 116 123) and US (988); change them for your country.
- **The form asks for very little.** Clients are told not to share sensitive details by form, and the consent line links to the privacy notice.
- **Fees up front**, including reduced-fee spaces and the cancellation policy, which cuts down back-and-forth emails.
- **Schema markup** (`ProfessionalService`) in the `<head>` helps Google show your practice name, area and price range. Update it with your details.

## Adding your photo

Replace the monogram in the hero with a photo of you. Find the `EDIT:` comment inside `<figure class="portrait">` and swap the `portrait-frame` contents for an `<img>`. A warm, natural photo near a window works better than a studio headshot. Use your own photo, never a stock image of someone else.

## Need help?

Email hello@craftmypage.com with your order number. Free fixes for any bug in the template, for life.

## Changelog

- **1.0.0** (October 2026): first release.
