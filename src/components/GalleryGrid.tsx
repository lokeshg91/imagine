import { useCallback, useEffect, useState } from "react";

export interface GalleryImage {
  src: string; // optimized URL produced by Astro in the parent page
  alt: string;
}

/**
 * React island: responsive image grid with a keyboard-accessible lightbox.
 * Unlike <Gallery>, this doesn't scroll/autoplay — every image sits in a
 * static grid, click any one to zoom into the full-size lightbox view.
 */
export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null ? i : (i + images.length - 1) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setOpen(i)}
            className="group aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label={`Open image: ${img.alt}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button className="absolute right-5 top-5 cursor-pointer text-3xl text-white" onClick={close} aria-label="Close">
            ×
          </button>
          <button
            className="absolute left-5 cursor-pointer text-4xl text-white/80 hover:text-white"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <img
            src={images[open].src}
            alt={images[open].alt}
            className="max-h-[85vh] max-w-[90vw] rounded object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-5 cursor-pointer text-4xl text-white/80 hover:text-white"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
