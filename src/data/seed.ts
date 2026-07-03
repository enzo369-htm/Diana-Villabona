import { IMAGES, VIIDEO } from "../images";
import type { AcercaContent, HomeConfig, Pieza, Post, Taller } from "../types/content";

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
    tecnica: "Objetos",
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
    tecnica: "Objetos",
    imagenes: [IMAGES.muestraSaggarHuella, IMAGES.barro],
    destacadaHome: true,
    disponible: true,
  },
  {
    id: "p3",
    titulo: "Silencio raku",
    descripcion: "Forma contenida, negros profundos y un brillo que solo el humo puede dar.",
    dimensiones: "16 × 30 cm",
    tecnica: "Escultura",
    imagenes: [IMAGES.muestraRakuSilencio],
    destacadaHome: true,
    disponible: false,
  },
  {
    id: "p4",
    titulo: "Esmaltes en la sala",
    descripcion: "Capas de color que dialogan con la luz lateral del estudio.",
    dimensiones: "Ø 25 cm",
    tecnica: "Ambiente",
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

export const acerca: AcercaContent = {
  imagen: IMAGES.quienSoy,
  texto: `La cerámica es el lugar donde conviven muchas de las cosas que me interesan: la tierra, el hacer con las manos, la investigación, el fuego, la naturaleza y el aprendizaje compartido. Mi práctica se desarrolla a través de la construcción manual y las quemas experimentales, y ha sido profundamente enriquecida por los encuentros, los viajes y las personas que generosamente han compartido sus conocimientos conmigo a lo largo del camino.

Mi búsqueda se ha centrado en la exploración de la forma, la investigación de superficies y las atmósferas de quema, acercándome a procesos donde el control convive con la incertidumbre. Con el tiempo he encontrado en la cerámica una práctica que me invita a ofrecer mi presencia, a observar con más atención, a aceptar la incertidumbre y a aprender de los procesos, dentro y fuera del taller.

Me atraen especialmente las huellas que deja el fuego y la manera en que cada quema transforma la materia de formas inesperadas. Me interesan los procesos donde existe espacio para la sorpresa y donde las piezas conservan rastros de las decisiones, los materiales y las circunstancias que las hicieron posibles. Mi trabajo se mueve entre lo utilitario y lo escultórico, donde cada pieza recoge algo de su propio recorrido.

Además de mi práctica de taller, desarrollo espacios de formación enfocados en la experimentación. Entiendo la enseñanza como una oportunidad para compartir conocimientos, intercambiar experiencias y seguir aprendiendo junto a otras personas.`,
};
