import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useContent } from "../context/ContentContext";
import { buildPortfolioBands } from "../data/portfolioImages";
import { obrasToMosaicCells } from "../data/selectors";
import type { PortfolioMosaicCell } from "../data/portfolioImages";

function PortfolioCell({
  cell,
  priority,
}: {
  cell: PortfolioMosaicCell;
  priority?: boolean;
}) {
  return (
    <Link
      to={`/portfolio/${cell.obraId}`}
      className="portfolio-band__cell hero__cell portfolio-band__link"
    >
      <img
        src={cell.src}
        alt={cell.titulo}
        width={800}
        height={1000}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
      <span className="portfolio-band__title">{cell.titulo}</span>
      <span className="portfolio-band__cta">
        Explorar
        <span className="portfolio-band__cta-arrow" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}

/** Pasillo vertical de mosaicos tipo rompecabezas. */
export function PortfolioCorridor() {
  const { obrasPortfolio } = useContent();
  const bands = useMemo(() => {
    const cells = obrasToMosaicCells(obrasPortfolio);
    return buildPortfolioBands(cells);
  }, [obrasPortfolio]);

  if (bands.length === 0) {
    return (
      <p className="portfolio-corridor__empty page-content page-content--pad">
        Aún no hay obras en el portafolio.
      </p>
    );
  }

  return (
    <div className="portfolio-corridor" role="presentation">
      {bands.map((band, bandIndex) => (
        <div
          key={`band-${bandIndex}-${band.variant}`}
          className={`portfolio-band portfolio-band--${band.variant}${
            bandIndex === 0 ? " portfolio-band--intro" : ""
          }`}
        >
          {band.cells.map((cell, cellIndex) => (
            <PortfolioCell
              key={`${cell.obraId}-${bandIndex}-${cellIndex}`}
              cell={cell}
              priority={bandIndex === 0 && cellIndex === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
