export type TecnicaPieza =
  | "Raku"
  | "Saggar"
  | "Obvara"
  | "Esmaltes"
  | "Modelado"
  | "Otro";

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
  cuerpoHtml: string;
  portada: string;
  fecha: string;
  videoUrl?: string;
  extracto: string;
  destacado?: boolean;
}

export type EstadoTaller = "proximo" | "en_curso" | "archivo";

export interface Taller {
  id: string;
  titulo: string;
  fecha: string;
  descripcion: string;
  estado: EstadoTaller;
}

export interface HomeConfig {
  /** Rutas de imágenes del hero (orden = orden en el carrusel). */
  heroImagenes: string[];
  idPostDestacado: string;
  /** Hasta 4 ids de piezas en la vitrina del home. */
  idsPiezasHome: string[];
}
