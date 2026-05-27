import { IMAGES } from "../images";
import type { ObraPortfolio } from "../types/content";

function img6(a: string, b: string, c: string, d: string, e: string, f: string): string[] {
  return [a, b, c, d, e, f];
}

/** Obras iniciales del muestrario (rutas en /public). */
export const obrasPortfolio: ObraPortfolio[] = [
  {
    id: "pf-1",
    titulo: "Craquelado y tormenta",
    texto:
      "Superficies que recogen la tensión del fuego rápido. Grietas como relámpagos sobre gres oscuro.",
    imagenes: img6(
      IMAGES.muestraTormentaCraquelado,
      IMAGES.reveladoCopia,
      IMAGES.hero5,
      IMAGES.hero2,
      IMAGES.muestraRakuSilencio,
      IMAGES.barro
    ),
    orden: 1,
  },
  {
    id: "pf-2",
    titulo: "Saggar: huellas",
    texto: "Materiales naturales envueltos en la pieza dejan trazos únicos en cada quema.",
    imagenes: img6(
      IMAGES.muestraSaggarHuella,
      IMAGES.muestraFiqueRaiz,
      IMAGES.hero6,
      IMAGES.hero7,
      IMAGES.muestraEnMuerte,
      IMAGES.revelado
    ),
    orden: 2,
  },
  {
    id: "pf-3",
    titulo: "Esmaltes en el estudio",
    texto: "Capas de color que dialogan con la luz lateral del taller.",
    imagenes: img6(
      IMAGES.muestraEsmaltesSala,
      IMAGES.muestraFormulacionEsmaltes,
      IMAGES.hero,
      IMAGES.hero3,
      IMAGES.hero4,
      IMAGES.podcast
    ),
    orden: 3,
  },
  {
    id: "pf-4",
    titulo: "Hornera y proceso",
    texto: "El calor como protagonista: preparación, carga y revelado de piezas.",
    imagenes: img6(
      IMAGES.muestraTallerHornera,
      IMAGES.fuegos,
      IMAGES.hero5,
      IMAGES.muestraTormentaCraquelado,
      IMAGES.quienSoy,
      IMAGES.podcastCopia
    ),
    orden: 4,
  },
  {
    id: "pf-5",
    titulo: "Silencio raku",
    texto: "Formas contenidas, negros profundos y un brillo que solo el humo puede dar.",
    imagenes: img6(
      IMAGES.muestraRakuSilencio,
      IMAGES.muestraWabiSabi,
      IMAGES.hero2,
      IMAGES.hero6,
      IMAGES.muestraSaggarHuella,
      IMAGES.barro
    ),
    orden: 5,
  },
  {
    id: "pf-6",
    titulo: "Pieles de quema",
    texto: "Experimentación con envolturas y atmósferas de saggar en gres.",
    imagenes: img6(
      "/Pieles%20de%20quemas%20experimentales..jpg",
      IMAGES.muestraEnMuerte,
      IMAGES.hero7,
      IMAGES.hero3,
      IMAGES.muestraFiqueRaiz,
      IMAGES.reveladoCopia
    ),
    orden: 6,
  },
  {
    id: "pf-7",
    titulo: "Raíz y materia",
    texto: "La arcilla y los materiales orgánicos como coautores del resultado final.",
    imagenes: img6(
      IMAGES.muestraFiqueRaiz,
      IMAGES.barro,
      IMAGES.hero,
      IMAGES.hero4,
      IMAGES.muestraTallerHornera,
      IMAGES.muestraEsmaltesSala
    ),
    orden: 7,
  },
  {
    id: "pf-8",
    titulo: "Revelado",
    texto: "El momento en que la pieza sale del fuego y muestra su piel definitiva.",
    imagenes: img6(
      IMAGES.revelado,
      IMAGES.reveladoCopia,
      IMAGES.muestraFormulacionEsmaltes,
      IMAGES.hero5,
      IMAGES.hero3,
      IMAGES.muestraRakuSilencio
    ),
    orden: 8,
  },
  {
    id: "pf-9",
    titulo: "Serie horizontal",
    texto: "Vistas del taller y piezas en distintos estados de acabado.",
    imagenes: img6(
      IMAGES.hero6,
      IMAGES.hero7,
      IMAGES.hero,
      IMAGES.hero2,
      IMAGES.hero3,
      IMAGES.hero4
    ),
    orden: 9,
  },
  {
    id: "pf-10",
    titulo: "Muerte y renacimiento",
    texto: "Piezas que hablan del ciclo del fuego: oxidación, craquelado y brillo.",
    imagenes: img6(
      IMAGES.muestraEnMuerte,
      IMAGES.muestraTormentaCraquelado,
      IMAGES.muestraSaggarHuella,
      IMAGES.podcast,
      IMAGES.quienSoy,
      IMAGES.muestraWabiSabi
    ),
    orden: 10,
  },
];
