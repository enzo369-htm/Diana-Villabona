import { useEffect, useState } from "react";
import { HERO_HORIZONTAL_IMAGES } from "../images";

const INTERVAL_MS = 3000;

export function HeroHorizontalCarousel() {
  const slides = HERO_HORIZONTAL_IMAGES;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="hero__carousel" role="presentation" aria-hidden>
      {slides.map((src, i) => (
        <div
          key={src}
          className={
            i === index
              ? "hero__carousel-slide hero__carousel-slide--active"
              : "hero__carousel-slide"
          }
        >
          <img
            src={src}
            alt=""
            width={1920}
            height={1080}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}
    </div>
  );
}
