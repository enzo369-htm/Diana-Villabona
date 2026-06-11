import { IMAGES } from "../images";
import type { ObraPortfolio } from "../types/content";

/**
 * IDs de obras antiguas que ya no se muestran. Se filtran tanto del seed como
 * de lo guardado en la nube, así no reaparecen aunque sigan en Supabase.
 */
export const retiredObraIds: string[] = [
  "pf-1",
  "pf-2",
  "pf-3",
  "pf-4",
  "pf-5",
  "pf-6",
  "pf-7",
  "pf-8",
  "pf-9",
  "pf-10",
];

/** Una sola imagen de portada por obra; la clienta cargará el resto desde el admin. */
function portada(src: string): string[] {
  return [src, "", "", "", "", ""];
}

/** Obras iniciales del muestrario (rutas en /public). */
export const obrasPortfolio: ObraPortfolio[] = [
  {
    id: "pf-cenizas-bambu",
    titulo: "Cenizas de Bambú",
    texto:
      "Este proyecto surgió a partir de una invitación para desarrollar unas piezas cerámicas para el encuentro del Laboratorio de Guadua, un espacio atravesado por el trabajo con bambú. Mi interés fue trasladar ese material a la cerámica y hacerlo presente desde su propia transformación.\n\nPara esta propuesta desarrollé esmaltes a partir de cenizas de bambú. El proceso inició con la quema, recolección y limpieza de las cenizas, seguido de múltiples pruebas hasta llegar a un esmalte que pudiera contener la huella del bambú dentro de la superficie cerámica.\n\nEste proyecto explora el diálogo entre la materia y cómo el barro puede convertirse en un espacio donde distintos lenguajes aparecen y se transforman.",
    imagenes: portada(IMAGES.muestraFormulacionEsmaltes),
    orden: 1,
  },
  {
    id: "pf-piedras",
    titulo: "Piedras",
    texto:
      "Siempre pienso en las piedras. En su silencio sostienen el tiempo. Es como si lo vieran todo morir y nacer, una y otra vez.",
    imagenes: portada(IMAGES.barro),
    orden: 2,
  },
  {
    id: "pf-cuerpos-leves",
    titulo: "Cuerpos leves (Arcilla de papel)",
    texto:
      "El entretejido de la celulosa crea una estructura ligera pero resistente. Pensar en papel y en quemas rápidas como el raku alguna vez me pareció contradictorio, pero la fuerza de las fibras transforma la arcilla y hace que la incorporación de pulpa funcione especialmente bien en procesos experimentales.\n\nEn esta serie de objetos quise hacer visible esa tensión: el puente entre la aparente fragilidad del papel y la fuerza interna que habita en sus fibras.",
    imagenes: portada(IMAGES.muestraRakuSilencio),
    orden: 3,
  },
  {
    id: "pf-colaboracion-cubel",
    titulo: "Colaboración CUBEL",
    texto:
      "Diseñamos estas piezas en colaboración con el diseñador de modas Humberto Cubides para el lanzamiento de su colección «La Colmena». En este proyecto exploramos acabados ricos en texturas a través de quemas experimentales, donde los materiales y el fuego tienen un papel fundamental en el resultado final.\n\nLa búsqueda se centró en tonos tierra, negros y superficies mates y rocosas, creando piezas con una presencia orgánica y táctil.",
    imagenes: portada(IMAGES.muestraTormentaCraquelado),
    orden: 4,
  },
  {
    id: "pf-entre-humos",
    titulo: "Entre humos",
    texto: "Obra en desarrollo…",
    imagenes: portada(IMAGES.muestraSaggarHuella),
    orden: 5,
  },
];
