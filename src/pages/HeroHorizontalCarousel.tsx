import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_HORIZONTAL_IMAGES } from "../images";

const INTERVAL_MS = 3000;

function preloadSlide(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function HeroHorizontalCarousel() {
  const slides = HERO_HORIZONTAL_IMAGES;
  const [{ current, prev }, setSlide] = useState({ current: 0, prev: 0 });
  const readyRef = useRef(slides.map((_, i) => i === 0));
  const currentRef = useRef(0);
  const [, bumpReady] = useState(0);

  const markReady = useCallback((i: number) => {
    if (!readyRef.current[i]) {
      readyRef.current[i] = true;
      bumpReady((n) => n + 1);
    }
  }, []);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    void Promise.all(slides.map((src, i) => preloadSlide(src).then(() => markReady(i))));
  }, [slides, markReady]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const id = window.setInterval(() => {
      const next = (currentRef.current + 1) % slides.length;
      if (!readyRef.current[next]) return;

      setSlide(({ current: cur }) => {
        currentRef.current = next;
        return { prev: cur, current: next };
      });
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="hero__carousel" role="presentation" aria-hidden>
      {slides.map((src, i) => {
        const isActive = i === current;
        const isPrev = i === prev && i !== current;
        const className = [
          "hero__carousel-slide",
          isActive ? "hero__carousel-slide--active" : "",
          isPrev ? "hero__carousel-slide--prev" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={src} className={className}>
            <img
              src={src}
              alt=""
              width={1920}
              height={1080}
              loading="eager"
              decoding="async"
              fetchPriority={i === 0 ? "high" : "auto"}
              onLoad={() => markReady(i)}
            />
          </div>
        );
      })}
    </div>
  );
}
