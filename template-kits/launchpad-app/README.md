# Launchpad, indie app launch page template

A launch page for an indie iPhone or Android app, built by someone who ships apps. It includes the two pages App Store Connect and Google Play insist on (Support URL and Privacy Policy URL), a privacy "nutrition label" section, a changelog and a pre-launch waitlist mode.

## What's in the box

- `index.html`: the launch page (hero with phone mockup, features, how it works, privacy label, maker note, pricing, changelog, FAQ).
- `support.html`: a support page, ready to use as your **App Store / Google Play Support URL**.
- `privacy.html`: a privacy policy to adapt, ready to use as your **Privacy Policy URL**.
- `404.html`: page-not-found.
- `styles.css`, `main.js`: all styling and the small amount of JavaScript.
- `assets/favicon.svg`: swap for your app icon.

## Quick start (10 minutes)

1. **Unzip** and open `index.html` in your browser to see the site.
2. **Edit the words.** Open `index.html` in any text editor (VS Code is free). Every place you need to change is marked with an `EDIT:` comment. Search for `EDIT` to find them all.
3. **Pick a colour palette.** Change `data-palette` on the `<html>` tag at the top of each page. Options: `ember` (default), `mint`, `iris`.
4. **Light and dark mode** work automatically. The site follows the visitor's system setting, and the sun/moon button lets them switch. Their choice is remembered.
5. **Connect the form** (see below), then **publish** (see below).

## Connect the contact form

The form posts to any form service. The simplest free options:

- **Formspree**: create a form at formspree.io, copy your form ID and replace `YOUR_FORM_ID` in the form's `action`.
- **Basin** (usebasin.com) or **Getform**: same idea, paste their endpoint into `action`.
- **Netlify Forms**: if you host on Netlify, add `data-netlify="true"` to the `<form>` and change `action` to `/`.

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

## Built for shipping an app

- **Pre-launch mode.** Set `data-mode="prelaunch"` on `<html>` and the store buttons become a waitlist form. Switch to `data-mode="live"` on launch day.
- **The phone in the hero is pure HTML and CSS**, so it looks sharp on every screen and needs no screenshots to start. Edit the task list inside `.phone-screen` to show your own app, or replace the screen's contents with `<img src="assets/screenshot.png" alt="...">` sized 1179x2556 (iPhone 6.7").
- **Use the official store badges.** Apple and Google require their official badge artwork. Download it from Apple's Marketing Resources (developer.apple.com/app-store/marketing/guidelines) and Google Play's badge generator (play.google.com/intl/en_us/badges), then replace the two `.store-btn` links. Keep the trademark line in the footer.
- **Smart App Banner.** Uncomment the `apple-itunes-app` meta tag and add your App Store ID, so Safari on iPhone offers to open or install the app.
- **Privacy label section.** Make it match what you declared in App Store Connect exactly. If you use analytics, crash reporting or a purchase SDK, say so here and in `privacy.html`.
- **Changelog** doubles as proof the app is alive. Add a line every release.
- **Schema markup** (`MobileApplication`) in the `<head>`: update the name, category and price.

## Need help?

Email hello@craftmypage.com with your order number. Free fixes for any bug in the template, for life.

## Changelog

- **1.0.0** (October 2026): first release.
