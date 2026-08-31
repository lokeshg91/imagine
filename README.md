# Imagine Photojournalist Society — Website

Static site built with **Astro + React + Tailwind CSS v4**, rebuilt from the
original WordPress site. No CMS, no database — content lives in the repo and the
site deploys as static HTML. A content change = edit a file, `git push`, done.

## Tech stack

| Layer      | Tool                                          |
| ---------- | --------------------------------------------- |
| Framework  | Astro (ships ~zero JS by default)             |
| Interactive| React islands (gallery lightbox, contact form)|
| Styling    | Tailwind CSS v4 + `@tailwindcss/typography`   |
| Images     | `astro:assets` `<Image />` → WebP/AVIF, lazy  |
| SEO        | Per-page meta + Open Graph + JSON-LD + sitemap|
| Hosting    | Vercel / Netlify / Cloudflare Pages (static)  |

## Commands

```bash
npm install       # install dependencies
npm run dev       # local dev server at http://localhost:4321
npm run build     # production build → ./dist
npm run preview   # preview the production build locally
```

## How to make the common yearly changes

Everything editors need is data — no code required.

### Update the event date / venue / tagline
Edit **`src/data/site.ts`** (the `event` and `site` objects).

### Swap the hero banner
Replace **`src/assets/hero/banner.png`** with the new image (keep the filename,
or update the import in `src/pages/index.astro`).

### Update the gallery ("Glimpse of Previous Edition")
Drop new photos into **`src/assets/`** and list them in the `gallerySources`
array in **`src/pages/index.astro`**.

### Add / edit / remove a speaker
Edit **`src/content/speakers.json`** and add the portrait to
`src/assets/speakers/`. Set `"featured": true` to show it on the homepage.

### Add a magazine issue
Add the cover to `src/assets/magazines/`, then add an entry to
**`src/content/magazines.json`** with its Google Drive `downloadUrl`.

### Add a blog post
Create a new `.md` file in **`src/content/blog/`** (copy an existing one for the
frontmatter shape) and put its cover image in `src/assets/blog/`.

### Add sponsors
Add logos to `src/assets/` and entries to **`src/content/sponsors.json`**.

## Project structure

```
src/
  assets/            optimized images (speakers, blog, magazines, hero, brand)
  components/        Header, Footer, SEO, SpeakerCard, SectionHeading (.astro)
                     Gallery, InternshipForm (.tsx — React islands)
  content/           speakers.json, magazines.json, sponsors.json, blog/*.md
  content.config.ts  content collection schemas (typed)
  data/site.ts       site + event config + navigation
  layouts/Layout.astro   base HTML shell (fonts, SEO, header, footer)
  lib/images.ts      resolves image paths from JSON data to optimized assets
  pages/             one file = one route
```

## Contact form

`src/components/InternshipForm.tsx` posts to a form endpoint. Two options:

1. **Formspree/Getform** (no backend): set the `action` URL — done.
2. **Serverless function**: add an adapter (`npx astro add vercel`), create
   `src/pages/api/apply.ts`, and send email via [Resend](https://resend.com).

## Deploy

Push to GitHub and import the repo on **Vercel** (or Netlify / Cloudflare Pages).
Framework preset auto-detects as Astro. Every `git push` redeploys.

> Before launch: update `site:` in `astro.config.mjs`, `site.url` in
> `src/data/site.ts`, the sitemap URL in `public/robots.txt`, and add a
> `public/og-default.jpg` (1200×630) for social sharing previews.
