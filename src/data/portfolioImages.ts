export type PortfolioBandVariant = "classic" | "mirror" | "split";

export type PortfolioMosaicCell = {
  obraId: string;
  titulo: string;
  src: string;
};

export type PortfolioBand = {
  variant: PortfolioBandVariant;
  cells: PortfolioMosaicCell[];
};

const VARIANTS: PortfolioBandVariant[] = ["classic", "mirror", "split"];

const SLOTS_PER_BAND = 5;

/** Agrupa obras en bandas de rompecabezas (5 celdas por banda, plantillas alternadas). */
export function buildPortfolioBands(
  cells: readonly PortfolioMosaicCell[]
): PortfolioBand[] {
  const bands: PortfolioBand[] = [];
  let index = 0;
  let variantIndex = 0;

  while (index < cells.length) {
    const chunk = cells.slice(index, index + SLOTS_PER_BAND);
    if (chunk.length === 0) break;
    bands.push({
      variant: VARIANTS[variantIndex % VARIANTS.length]!,
      cells: chunk,
    });
    index += chunk.length;
    variantIndex += 1;
  }

  return bands;
}
