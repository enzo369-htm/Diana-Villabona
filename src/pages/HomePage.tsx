import { IMAGES } from "../images";

/**
 * Mosaico de 5 fotos: grid 2×2 + columna derecha a todo alto.
 */
function HeroImg({
  src,
  priority,
  className,
}: {
  src: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={className ? `hero__cell ${className}` : "hero__cell"}>
      <img
        src={src}
        alt=""
        width={600}
        height={600}
        loading="eager"
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
    </div>
  );
}

function HeroMosaic() {
  return (
    <div
      className="hero__mosaic hero__mosaic--grid-5"
      role="presentation"
      aria-hidden
    >
      <HeroImg src={IMAGES.hero5} priority />
      <HeroImg src={IMAGES.hero2} />
      <HeroImg src={IMAGES.hero6} />
      <HeroImg src={IMAGES.hero7} />
      <HeroImg src={IMAGES.hero} />
    </div>
  );
}

export function HomePage() {
  return (
    <section className="hero" id="inicio" aria-label="Bienvenida">
      <div className="hero__image-wrap" aria-hidden>
        <HeroMosaic />
      </div>
    </section>
  );
}
