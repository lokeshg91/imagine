import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface GalleryImage {
  src: string; // optimized URL produced by Astro in the parent page
  alt: string;
}

const AUTOPLAY_MS = 3500;

/**
 * React island: horizontal snap-scroll slider with autoplay, a scaled-up
 * center card, and a keyboard-accessible lightbox. Images are optimized by
 * Astro in the parent .astro file and passed in as URLs, so the island
 * ships only the interaction logic — not an image pipeline.
 */
export default function Gallery({ images }: { images: GalleryImage[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
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

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    const target = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  // Browsers can restore a scrollable element's previous scroll offset on
  // reload/navigation, which would otherwise leave the slider starting
  // mid-gallery. Force it back to the first card before paint.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = 0;
    setActiveIndex(0);
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((i) => {
        const next = (i + dir + images.length) % images.length;
        goTo(next);
        return next;
      });
    },
    [images.length, goTo],
  );

  // Track which card is nearest the center of the viewport as the user
  // scrolls (drag, arrows, or autoplay all funnel through here).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect();
        const center = trackRect.left + trackRect.width / 2;
        let closest = 0;
        let closestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const r = card.getBoundingClientRect();
          const dist = Math.abs(r.left + r.width / 2 - center);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        setActiveIndex(closest);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [images.length]);

  // Autoplay — pauses on hover/touch and while the lightbox is open.
  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      if (pausedRef.current || open !== null) return;
      step(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [images.length, open, step]);

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
      <div
        className="group/slider relative"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onTouchStart={() => (pausedRef.current = true)}
        onTouchEnd={() => (pausedRef.current = false)}
      >
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[5%] py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              ref={(el) => { cardRefs.current[i] = el; }}
              onClick={() => setOpen(i)}
              className={`group aspect-[3/2] w-[90%] flex-none snap-center overflow-hidden rounded-xl bg-gray-100 transition-[transform,opacity] duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] ${
                i === activeIndex ? "scale-105 z-10 opacity-100" : "scale-100 opacity-85"
              }`}
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

        <button
          type="button"
          onClick={() => step(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity duration-300 hover:bg-black/60 focus-visible:opacity-100 group-hover/slider:opacity-100"
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity duration-300 hover:bg-black/60 focus-visible:opacity-100 group-hover/slider:opacity-100"
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
