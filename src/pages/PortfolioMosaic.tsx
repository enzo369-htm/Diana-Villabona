import { IMAGES } from "../images";

const MOSAIC_IMAGES = [
  IMAGES.hero5,
  IMAGES.hero2,
  IMAGES.hero6,
  IMAGES.hero7,
  IMAGES.hero,
] as const;

function MosaicCell({
  src,
  priority,
}: {
  src: string;
  priority?: boolean;
}) {
  return (
    <div className="hero__cell">
      <img
        src={src}
        alt=""
        width={600}
        height={600}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
    </div>
  );
}

/** Mosaico 5 fotos: grid 2×2 + columna derecha a todo alto (diseño hero original). */
export function PortfolioMosaic() {
  return (
    <div
      className="hero__mosaic hero__mosaic--grid-5"
      role="presentation"
      aria-hidden
    >
      {MOSAIC_IMAGES.map((src, index) => (
        <MosaicCell key={src} src={src} priority={index === 0} />
      ))}
    </div>
  );
}
