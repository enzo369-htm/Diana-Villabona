import { IMAGES, VIIDEO } from "../images";
import type { HomeConfig, Pieza, Post, Taller } from "../types/content";

export const homeConfig: HomeConfig = {
  heroImagenes: [
    IMAGES.hero5,
    IMAGES.hero2,
    IMAGES.hero6,
    IMAGES.hero7,
    IMAGES.hero,
  ],
  idPostDestacado: "post-1",
  idsPiezasHome: ["p1", "p2", "p3", "p4", "p5"],
};

export const piezas: Pieza[] = [
  {
    id: "p1",
    titulo: "Tormenta en craquelado",
    descripcion:
      "Pieza de gres con superficie craquelada que recoge la tensión y el alivio del fuego rápido.",
    dimensiones: "28 × 22 cm",
    tecnica: "Raku",
    imagenes: [IMAGES.muestraTormentaCraquelado, IMAGES.reveladoCopia],
    destacadaHome: true,
    disponible: true,
    historia:
      "Nacida de una quema experimental donde el esmalte pidió grietas como relámpagos sobre arcilla oscura.",
  },
  {
    id: "p2",
    titulo: "Saggar: huella",
    descripcion:
      "Envoltura de materiales naturales que dejan trazos únicos en la piel de la pieza.",
    dimensiones: "20 × 20 cm",
    tecnica: "Saggar",
    imagenes: [IMAGES.muestraSaggarHuella, IMAGES.barro],
    destacadaHome: true,
    disponible: true,
  },
  {
    id: "p3",
    titulo: "Silencio raku",
    descripcion: "Forma contenida, negros profundos y un brillo que solo el humo puede dar.",
    dimensiones: "16 × 30 cm",
    tecnica: "Raku",
    imagenes: [IMAGES.muestraRakuSilencio],
    destacadaHome: true,
    disponible: false,
  },
  {
    id: "p4",
    titulo: "Esmaltes en la sala",
    descripcion: "Capas de color que dialogan con la luz lateral del estudio.",
    dimensiones: "Ø 25 cm",
    tecnica: "Esmaltes",
    imagenes: [IMAGES.muestraEsmaltesSala, IMAGES.podcast],
    destacadaHome: true,
    disponible: true,
  },
  {
    id: "p5",
    titulo: "Raíz y fique",
    descripcion: "Textura vegetal impresa en la piel cerámica antes del fuego.",
    dimensiones: "22 × 15 cm",
    tecnica: "Modelado",
    imagenes: [IMAGES.muestraFiqueRaiz],
    destacadaHome: true,
    disponible: true,
  },
];

export const posts: Post[] = [
  {
    id: "post-1",
    titulo: "Título de la entrada",
    extracto: "Extracto.",
    portada: IMAGES.muestraTallerHornera,
    fecha: "",
    destacado: true,
    cuerpoHtml: "<p>Cuerpo de la entrada.</p>",
  },
  {
    id: "post-2",
    titulo: "Título de la entrada",
    extracto: "Extracto.",
    portada: IMAGES.muestraFormulacionEsmaltes,
    fecha: "",
    cuerpoHtml: "<p>Cuerpo de la entrada.</p>",
  },
];

export const talleres: Taller[] = [
  {
    id: "t1",
    titulo: "Quema experimental: intro a Raku",
    fecha: "2026-06-07",
    descripcion:
      "Jornada en el estudio: preparación de piezas, reducción y enfriamiento brusco. Cupos limitados.",
    estado: "proximo",
  },
  {
    id: "t2",
    titulo: "Saggar en primavera",
    fecha: "2025-11-02",
    descripcion:
      "Taller cerrado. Archivo de materiales orgánicos que usamos y de los resultados en gres.",
    estado: "archivo",
  },
];

/** URL del vídeo de contexto (home); enlazado también desde CMS en el futuro. */
export const contextoVideoSrc = VIIDEO;
