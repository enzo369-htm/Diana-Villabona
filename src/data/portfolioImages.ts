/** Fotos en /public para el pasillo de portfolio (rutas únicas, sin duplicados). */
export const PORTFOLIO_IMAGES: readonly string[] = [
  "/hero5.jpg",
  "/hero2.jpg",
  "/hero6.jpg",
  "/hero7.jpg",
  "/hero.jpg",
  "/hero3.jpg",
  "/hero4.jpg",
  "/muestra-tormenta-craquelado.jpg",
  "/muestra-saggar-huella.jpg",
  "/muestra-raku-silencio.jpg",
  "/muestra-esmaltes-sala.jpg",
  "/muestra-fique-raiz.jpg",
  "/muestra-formulacion-esmaltes.jpg",
  "/muestra-taller-hornera.jpg",
  "/muestra-en-muerte.jpg",
  "/revelado-copia.jpg",
  "/barro.jpg",
  "/podcast-copia.jpg",
  "/quien-soy.jpg",
  "/Pieles%20de%20quemas%20experimentales..jpg",
];

export type PortfolioBandVariant = "classic" | "mirror" | "split";

export type PortfolioBand = {
  variant: PortfolioBandVariant;
  images: string[];
};

const VARIANTS: PortfolioBandVariant[] = ["classic", "mirror", "split"];

const SLOTS_PER_BAND = 5;

/** Agrupa imágenes en bandas de rompecabezas (5 celdas por banda, plantillas alternadas). */
export function buildPortfolioBands(
  images: readonly string[] = PORTFOLIO_IMAGES
): PortfolioBand[] {
  const bands: PortfolioBand[] = [];
  let index = 0;
  let variantIndex = 0;

  while (index < images.length) {
    const chunk = images.slice(index, index + SLOTS_PER_BAND);
    if (chunk.length === 0) break;
    bands.push({
      variant: VARIANTS[variantIndex % VARIANTS.length]!,
      images: chunk,
    });
    index += chunk.length;
    variantIndex += 1;
  }

  return bands;
}
