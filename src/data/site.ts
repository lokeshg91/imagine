// Central site + event configuration.
// Edit these values when the event details change — nothing else needs touching.

export const site = {
  name: "Imagine Photojournalist Society",
  shortName: "Imagine Photojournalist Society",
  // Used for absolute URLs (sitemap, canonical, OG tags). Update on launch.
  url: "https://imaginephotojournalists.com",
  description:
    "The Imagine Photojournalist Society hosts the annual Jaipur Photojournalism Seminar — celebrating real photojournalism that records reality.",
  tagline: ["REAL", "PHOTOJOURNALISM", "RECORDS REALITY"],
  email: "info@imaginephotojournalists.com",
  ogImage: "/og-default.jpg", // drop a 1200x630 image in /public
} as const;

export const event = {
  edition: "12th Edition",
  title: "Jaipur Photojournalism Seminar",
  date: "9 October, 2026",
  isoDate: "2026-10-09",
  venue: "Rajasthan International Centre in Jaipur",
  city: "Jaipur",
} as const;

// Primary navigation. `children` renders a dropdown.
export const nav = [
  { label: "Home", href: "/" },
  {
    label: "About us",
    href: "#",
    children: [
      { label: "Who we are", href: "/who-we-are" },
      { label: "Team", href: "/team" },
    ],
  },
  { label: "Events", href: "/events" },
  { label: "Speakers", href: "/speakers" },
  { label: "Magazine", href: "/magazine" },
  { label: "Press", href: "/press" },
] as const;

// The highlighted CTA button in the header.
export const cta = { label: "Apply for Internship", href: "/apply-for-internship" } as const;
