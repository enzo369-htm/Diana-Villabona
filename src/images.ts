/**
 * Rutas a jpgs en /public (solo nombres que existan en la carpeta).
 */
export const IMAGES = {
  hero: "/hero.jpg",
  hero2: "/hero2.jpg",
  hero3: "/hero3.jpg",
  hero4: "/hero4.jpg",
  hero5: "/hero5.jpg",
  hero6: "/hero6.jpg",
  hero7: "/hero7.jpg",
  /** Sustitutos si no hay revelado.jpg / fuegos.jpg / podcast.jpg en public */
  fuegos: "/muestra-en-muerte.jpg",
  barro: "/barro.jpg",
  revelado: "/revelado-copia.jpg",
  reveladoCopia: "/muestra-tormenta-craquelado.jpg",
  podcast: "/muestra-esmaltes-sala.jpg",
  podcastCopia: "/podcast-copia.jpg",
  quienSoy: "/quien-soy.jpg",
  muestraEnMuerte: "/muestra-en-muerte.jpg",
  muestraEsmaltesSala: "/muestra-esmaltes-sala.jpg",
  muestraRakuSilencio: "/muestra-raku-silencio.jpg",
  muestraFiqueRaiz: "/muestra-fique-raiz.jpg",
  muestraTormentaCraquelado: "/muestra-tormenta-craquelado.jpg",
  muestraWabiSabi: "/muestra-raku-silencio.jpg",
  muestraSaggarHuella: "/muestra-saggar-huella.jpg",
  muestraTallerHornera: "/muestra-taller-hornera.jpg",
  muestraFormulacionEsmaltes: "/muestra-formulacion-esmaltes.jpg",
} as const;

/** Rutas de fotos en /public para elegir 3 al azar (p. ej. sección Labor). */
export const GALLERY_POOL: readonly string[] = Object.values(
  IMAGES
) as unknown as string[];

/** Toma `n` rutas distintas al azar (sin repetir). */
export function pickRandomUnique(srcs: readonly string[], n: number): string[] {
  const pool = [...srcs];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, Math.min(n, pool.length));
}

/** Vídeo en /public (symlink o copia; p. ej. viideo.mp4) */
export const VIIDEO = "/viideo.mp4" as const;
