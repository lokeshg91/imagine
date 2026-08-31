import type { ImageMetadata } from "astro";

// Eagerly import every image under src/assets so data collections (JSON) can
// reference them by path string and still get Astro's optimized ImageMetadata.
const assets = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/**/*.{png,jpg,jpeg,webp,avif,gif}",
  { eager: true },
);

/**
 * Resolve an image path (e.g. "speakers/ina-shastri.png") to its optimized
 * ImageMetadata for use with <Image src={...} />.
 * Accepts values with or without a leading "/src/assets/".
 */
export function asset(path: string): ImageMetadata {
  const key = path.startsWith("/src/assets/")
    ? path
    : `/src/assets/${path.replace(/^\/+/, "")}`;
  const mod = assets[key];
  if (!mod) {
    throw new Error(
      `Image not found: "${path}". Looked for "${key}". Add it under src/assets/.`,
    );
  }
  return mod.default;
}
