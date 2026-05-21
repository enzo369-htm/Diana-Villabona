/**
 * Imágenes en /public orientación vertical (alto > ancho).
 * Orden alfabético por ruta estable; índices pares → panel izquierdo,
 * impares → panel derecho (cada lado rota cada 2 s en sincronía).
 */
export const VERTICAL_HERO_IMAGES: readonly string[] = [
  "/Pieles%20de%20quemas%20experimentales..jpg",
  "/hero.jpg",
  "/hero3.jpg",
  "/hero4.jpg",
  "/hero7.jpg",
  "/muestra-en-muerte.jpg",
  "/muestra-esmaltes-sala.jpg",
  "/muestra-fique-raiz.jpg",
  "/muestra-formulacion-esmaltes.jpg",
  "/muestra-raku-silencio.jpg",
  "/muestra-saggar-huella.jpg",
  "/muestra-taller-hornera.jpg",
  "/muestra-tormenta-craquelado.jpg",
  "/podcast-copia.jpg",
  "/quien-soy.jpg",
];

export function heroSplitQueues(
  paths: readonly string[]
): { left: string[]; right: string[] } {
  const left = paths.filter((_, i) => i % 2 === 0);
  const right = paths.filter((_, i) => i % 2 === 1);
  if (left.length === 0 && right.length > 0) {
    return { left: [...right], right: [...right] };
  }
  if (right.length === 0 && left.length > 0) {
    return { left: [...left], right: [...left] };
  }
  return { left: [...left], right: [...right] };
}
