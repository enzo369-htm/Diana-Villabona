import { useEffect, useMemo, useState } from "react";
import {
  VERTICAL_HERO_IMAGES,
  heroSplitQueues,
} from "../data/verticalHeroImages";

/** Tiempo entre cambios de imagen (izq. y der. a la vez). */
const INTERVAL_MS = 1000;

function HeroPane({
  src,
  side,
  priority,
}: {
  src: string;
  side: "left" | "right";
  priority?: boolean;
}) {
  return (
    <div
      className={`hero__split-pane hero__split-pane--${side}`}
      role="presentation"
      aria-hidden
    >
      <img
        key={src}
        className="hero__split-img"
        src={src}
        alt=""
        width={1080}
        height={1440}
        loading="eager"
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
}

/**
 * Hero pantalla completa: dos columnas 50/50. A intervalos regulares cambian ambas fotos a la vez
 * (izquierda y derecha siguen cada una su cola verticales impar/pair).
 */
export function HeroDynamicSplit() {
  const { left, right } = useMemo(
    () => heroSplitQueues(VERTICAL_HERO_IMAGES),
    []
  );

  const [idxL, setIdxL] = useState(0);
  const [idxR, setIdxR] = useState(0);

  useEffect(() => {
    const L = left.length;
    const R = right.length;
    if (L === 0 && R === 0) return;

    const id = window.setInterval(() => {
      if (L > 0) setIdxL((i) => (i + 1) % L);
      if (R > 0) setIdxR((i) => (i + 1) % R);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [left, right]);

  const srcL =
    left.length > 0
      ? left[idxL % left.length]
      : right[idxR % right.length] ?? "";
  const srcR =
    right.length > 0
      ? right[idxR % right.length]
      : left[idxL % left.length] ?? "";

  if (!srcL && !srcR) return null;

  return (
    <div
      className="hero__split"
      role="presentation"
      aria-hidden
    >
      {srcL ? <HeroPane src={srcL} side="left" priority /> : null}
      {srcR ? <HeroPane src={srcR} side="right" priority={!srcL} /> : null}
    </div>
  );
}
