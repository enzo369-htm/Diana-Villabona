import { useMemo } from "react";
import {
  buildPortfolioBands,
  PORTFOLIO_IMAGES,
} from "../data/portfolioImages";

function PortfolioCell({
  src,
  priority,
}: {
  src: string;
  priority?: boolean;
}) {
  return (
    <div className="portfolio-band__cell hero__cell">
      <img
        src={src}
        alt=""
        width={800}
        height={1000}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
    </div>
  );
}

/** Pasillo vertical de mosaicos tipo rompecabezas. */
export function PortfolioCorridor() {
  const bands = useMemo(() => buildPortfolioBands(PORTFOLIO_IMAGES), []);

  return (
    <div className="portfolio-corridor" role="presentation">
      {bands.map((band, bandIndex) => (
        <div
          key={`band-${bandIndex}-${band.variant}`}
          className={`portfolio-band portfolio-band--${band.variant}${
            bandIndex === 0 ? " portfolio-band--intro" : ""
          }`}
        >
          {band.images.map((src, cellIndex) => (
            <PortfolioCell
              key={`${bandIndex}-${cellIndex}-${src}`}
              src={src}
              priority={bandIndex === 0 && cellIndex === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
