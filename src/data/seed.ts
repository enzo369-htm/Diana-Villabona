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
  idsPiezasHome: ["p1", "p2", "p3", "p4"],
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
];

export const posts: Post[] = [
  {
    id: "post-1",
    titulo: "Título de la entrada",
    extracto: "Extracto.",
    portada: IMAGES.imgblog1,
    fecha: "",
    destacado: true,
    cuerpo: "Cuerpo de la entrada.",
  },
  {
    id: "post-2",
    titulo: "Título de la entrada",
    extracto: "Extracto.",
    portada: IMAGES.imgblog2,
    fecha: "",
    cuerpo: "Cuerpo de la entrada.",
  },
];

export const talleres: Taller[] = [
  {
    id: "t1",
    titulo: "Quema experimental: intro a Raku",
    fecha: "2026-06-07",
    descripcion:
      "Muchas veces buscamos resultados, pero estamos lejos de la materia. Jornada en el estudio: preparación de piezas, reducción y enfriamiento brusco. Cupos limitados.",
    estado: "proximo",
    orden: 1,
  },
  {
    id: "t2",
    titulo: "Saggar: materia y fuego",
    fecha: "2026-08-14",
    descripcion:
      "Encuentro para explorar materiales orgánicos, envolturas y la sorpresa del horno. Trabajamos piezas en gres y registramos cada quema con calma.",
    estado: "proximo",
    orden: 2,
  },
  {
    id: "t3",
    titulo: "Introducción al torno",
    fecha: "2026-09-20",
    descripcion:
      "Primeros pasos en el torno: centrado, elevación y formas simples. Priorizamos escuchar el barro y entender el gesto antes que el resultado.",
    estado: "proximo",
    orden: 3,
  },
  {
    id: "t4",
    titulo: "Esmaltes y formulación",
    fecha: "2026-10-11",
    descripcion:
      "Estos últimos meses he tenido encuentros muy valiosos que me han regresado a la importancia de entender el material, los procesos y la materia en su conjunto.",
    estado: "proximo",
    orden: 4,
  },
  {
    id: "t5",
    titulo: "Círculo de modelado",
    fecha: "2025-05-18",
    descripcion:
      "Sesión abierta de modelado y observación. Compartimos técnicas de pellizco, placa y superficie sin apuro por terminar piezas.",
    estado: "archivo",
    orden: 5,
  },
  {
    id: "t6",
    titulo: "Saggar en primavera",
    fecha: "2025-11-02",
    descripcion:
      "Taller cerrado. Archivo de materiales orgánicos que usamos y de los resultados en gres. Una mirada al proceso más que al objeto final.",
    estado: "archivo",
    orden: 6,
  },
];

/** URL del vídeo de contexto (home); enlazado también desde CMS en el futuro. */
export const contextoVideoSrc = VIIDEO;
