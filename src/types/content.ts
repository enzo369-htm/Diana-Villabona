export const TECNICAS_PIEZA = ["Objetos", "Ambiente", "Escultura"] as const;

export type TecnicaPieza = (typeof TECNICAS_PIEZA)[number];

export interface Pieza {
  id: string;
  titulo: string;
  descripcion: string;
  /** Dimensiones en texto libre, p. ej. "24 × 18 cm" */
  dimensiones: string;
  tecnica: TecnicaPieza;
  imagenes: string[];
  destacadaHome: boolean;
  disponible: boolean;
  historia?: string;
}

export interface Post {
  id: string;
  titulo: string;
  /** Texto plano del cuerpo (el sitio lo convierte a HTML al mostrarlo). */
  cuerpo: string;
  portada: string;
  fecha: string;
  videoUrl?: string;
  extracto: string;
  destacado?: boolean;
  /** Hasta 5 imágenes que se muestran a la derecha del texto de la entrada. */
  imagenes?: string[];
  /** Orden en la vitrina de bitácora (menor = primero; 1 es la primera). */
  orden?: number;
}

export const POST_IMAGENES_MAX = 5;

export type EstadoTaller = "proximo" | "en_curso" | "archivo";

export interface Taller {
  id: string;
  titulo: string;
  fecha: string;
  descripcion: string;
  estado: EstadoTaller;
  /** URL del botón Explorar (WhatsApp, formulario, etc.). Vacío = WhatsApp por defecto. */
  enlace?: string;
  /** Orden en la grilla (menor = primero). Máx. 6 visibles en la página. */
  orden?: number;
}

export const TALLERES_GRILLA_MAX = 6;

/** Obra en el muestrario de portfolio (6 fotos + texto). */
export interface ObraPortfolio {
  id: string;
  titulo: string;
  texto: string;
  /** Exactamente 6 imágenes: fila superior 1–3, inferior 4–6. La 1 es portada del mosaico. */
  imagenes: string[];
  /** Orden en el pasillo del portfolio (menor = primero). */
  orden?: number;
}

export const OBRAS_PORTFOLIO_IMAGENES = 6;

/** Contenido editable de la página Acerca. */
export interface AcercaContent {
  /** Texto plano; párrafos separados por línea en blanco. */
  texto: string;
  /** URL de la foto principal. */
  imagen: string;
}

export interface HomeConfig {
  /** Rutas de imágenes del hero (orden = orden en el carrusel). */
  heroImagenes: string[];
  idPostDestacado: string;
  /** Hasta 4 ids de piezas en la vitrina del home. */
  idsPiezasHome: string[];
}
