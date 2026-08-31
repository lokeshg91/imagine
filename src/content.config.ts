import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

// --- Speakers -------------------------------------------------------------
// Data lives in src/content/speakers.json. `image` is a path under src/assets.
const speakers = defineCollection({
  loader: file("src/content/speakers.json"),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    image: z.string(), // e.g. "speakers/ina-shastri.png"
    featured: z.boolean().default(false),
    order: z.number().default(0),
    bio: z.string().optional(),
  }),
});

// --- Team -------------------------------------------------------------
const team = defineCollection({
  loader: file("src/content/team.json"),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    image: z.string(), // e.g. "team/rohit-parihar.png"
    order: z.number().default(0),
  }),
});

// --- Sponsors -------------------------------------------------------------
const sponsors = defineCollection({
  loader: file("src/content/sponsors.json"),
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().url().optional(),
  }),
});

// --- Magazines ------------------------------------------------------------
const magazines = defineCollection({
  loader: file("src/content/magazines.json"),
  schema: z.object({
    title: z.string(),
    cover: z.string(),
    // A relative path (e.g. "/magazines/x.pdf" — public/) or a full URL.
    // Omit entirely when no PDF is available yet — the download button
    // is hidden for that issue.
    downloadUrl: z.string().optional(),
    publishedDate: z.string(), // ISO date, e.g. "2025-06-15"
  }),
});

// --- Blog -----------------------------------------------------------------
// One Markdown file per post in src/content/blog/.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string().default("Blog"),
      cover: image(), // relative path in the .md frontmatter, optimized by Astro
      publishedDate: z.coerce.date(),
      excerpt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { speakers, sponsors, magazines, blog, team };
