import type { ObraPortfolio, Pieza, Post, Taller, TecnicaPieza } from "../types/content";
import { OBRAS_PORTFOLIO_IMAGENES, TECNICAS_PIEZA } from "../types/content";

const STORAGE_KEY = "dvc-cms-catalogo-v1";

export type StoredCms = {
  piezas: Pieza[];
  posts: Post[];
  obrasPortfolio: ObraPortfolio[];
  talleres: Taller[];
};

/** Migra entradas guardadas con el campo antiguo `cuerpoHtml` (HTML → texto). */
function legacyHtmlToPlain(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) =>
      String.fromCharCode(parseInt(h, 16))
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeStoredPost(raw: unknown): Post {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  let cuerpo = typeof o.cuerpo === "string" ? o.cuerpo : "";
  if (!cuerpo && typeof o.cuerpoHtml === "string") {
    cuerpo = legacyHtmlToPlain(o.cuerpoHtml);
  }
  const id =
    typeof o.id === "string" && o.id.length > 0 ? o.id : `post-${Date.now()}`;
  const video =
    typeof o.videoUrl === "string" && o.videoUrl.trim() ? o.videoUrl.trim() : undefined;
  return {
    id,
    titulo: typeof o.titulo === "string" ? o.titulo : "",
    extracto: typeof o.extracto === "string" ? o.extracto : "",
    portada: typeof o.portada === "string" ? o.portada : "",
    fecha: typeof o.fecha === "string" ? o.fecha : "",
    cuerpo,
    destacado: Boolean(o.destacado),
    ...(video ? { videoUrl: video } : {}),
  };
}

export function normalizeStoredObraPortfolio(raw: unknown): ObraPortfolio {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const id =
    typeof o.id === "string" && o.id.length > 0 ? o.id : `pf-${Date.now()}`;
  const imagenesRaw = Array.isArray(o.imagenes)
    ? o.imagenes.filter((x): x is string => typeof x === "string")
    : [];
  const imagenes = [...imagenesRaw];
  while (imagenes.length < OBRAS_PORTFOLIO_IMAGENES) imagenes.push("");
  imagenes.length = OBRAS_PORTFOLIO_IMAGENES;

  return {
    id,
    titulo: typeof o.titulo === "string" ? o.titulo : "",
    texto: typeof o.texto === "string" ? o.texto : "",
    imagenes,
    ...(typeof o.orden === "number" && Number.isFinite(o.orden)
      ? { orden: o.orden }
      : {}),
  };
}

export function normalizeStoredTaller(raw: unknown): Taller {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const id =
    typeof o.id === "string" && o.id.length > 0 ? o.id : `t-${Date.now()}`;
  const estadoRaw = o.estado;
  const estado: Taller["estado"] =
    estadoRaw === "proximo" || estadoRaw === "en_curso" || estadoRaw === "archivo"
      ? estadoRaw
      : "proximo";
  const enlace =
    typeof o.enlace === "string" && o.enlace.trim() ? o.enlace.trim() : undefined;

  return {
    id,
    titulo: typeof o.titulo === "string" ? o.titulo : "",
    fecha: typeof o.fecha === "string" ? o.fecha : "",
    descripcion: typeof o.descripcion === "string" ? o.descripcion : "",
    estado,
    ...(enlace ? { enlace } : {}),
    ...(typeof o.orden === "number" && Number.isFinite(o.orden)
      ? { orden: o.orden }
      : {}),
  };
}

export function loadCms(): StoredCms | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<{
      piezas: Pieza[];
      posts: unknown[];
      obrasPortfolio: unknown[];
      talleres: unknown[];
    }>;
    if (!Array.isArray(data.piezas) || !Array.isArray(data.posts)) return null;
    return {
      piezas: data.piezas,
      posts: data.posts.map(normalizeStoredPost),
      obrasPortfolio: Array.isArray(data.obrasPortfolio)
        ? data.obrasPortfolio.map(normalizeStoredObraPortfolio)
        : [],
      talleres: Array.isArray(data.talleres)
        ? data.talleres.map(normalizeStoredTaller)
        : [],
    };
  } catch {
    return null;
  }
}

export function saveCms(data: StoredCms): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearCms(): void {
  localStorage.removeItem(STORAGE_KEY);
}

const LEGACY_TECNICA_MAP: Record<string, TecnicaPieza> = {
  Raku: "Escultura",
  Saggar: "Objetos",
  Obvara: "Objetos",
  Esmaltes: "Ambiente",
  Modelado: "Escultura",
  Otro: "Objetos",
};

export function normalizeTecnicaPieza(raw: unknown): TecnicaPieza {
  if (
    typeof raw === "string" &&
    (TECNICAS_PIEZA as readonly string[]).includes(raw)
  ) {
    return raw as TecnicaPieza;
  }
  if (typeof raw === "string" && raw in LEGACY_TECNICA_MAP) {
    return LEGACY_TECNICA_MAP[raw]!;
  }
  return "Objetos";
}

function normalizeStoredPieza(raw: unknown): Pieza {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const id =
    typeof o.id === "string" && o.id.length > 0 ? o.id : `p-${Date.now()}`;
  return {
    id,
    titulo: typeof o.titulo === "string" ? o.titulo : "",
    descripcion: typeof o.descripcion === "string" ? o.descripcion : "",
    dimensiones: typeof o.dimensiones === "string" ? o.dimensiones : "",
    tecnica: normalizeTecnicaPieza(o.tecnica),
    imagenes: Array.isArray(o.imagenes)
      ? o.imagenes.filter((x): x is string => typeof x === "string")
      : [],
    destacadaHome: Boolean(o.destacadaHome),
    disponible: o.disponible !== false,
    historia: typeof o.historia === "string" ? o.historia : undefined,
  };
}

/** El seed es la base; el CMS puede editar existentes y añadir piezas nuevas. */
export function mergePiezasWithSeed(stored: Pieza[] | null, seed: Pieza[]): Pieza[] {
  if (!stored) return seed;
  const storedById = new Map(
    stored.map((p) => [p.id, normalizeStoredPieza(p)])
  );
  const seedIds = new Set(seed.map((s) => s.id));

  const merged = seed.map((s) => {
    const override = storedById.get(s.id);
    return override
      ? normalizeStoredPieza({ ...s, ...override, id: s.id })
      : s;
  });

  const extras = stored
    .filter((p) => p.id && !seedIds.has(p.id))
    .map(normalizeStoredPieza);
  return extras.length > 0 ? [...merged, ...extras] : merged;
}

/** El seed es la base; el CMS puede editar existentes y añadir entradas nuevas. */
export function mergePostsWithSeed(stored: Post[] | null, seed: Post[]): Post[] {
  if (!stored) return seed;
  const storedById = new Map(stored.map((p) => [p.id, p]));
  const seedIds = new Set(seed.map((s) => s.id));

  const merged = seed.map((s) => {
    const override = storedById.get(s.id);
    return override ? normalizeStoredPost({ ...s, ...override, id: s.id }) : s;
  });

  const extras = stored
    .filter((p) => p.id && !seedIds.has(p.id))
    .map(normalizeStoredPost);
  return extras.length > 0 ? [...merged, ...extras] : merged;
}

/** El seed es la base; el CMS puede editar existentes y añadir obras nuevas. */
export function mergeObrasPortfolioWithSeed(
  stored: ObraPortfolio[] | null,
  seed: ObraPortfolio[]
): ObraPortfolio[] {
  if (!stored) return seed;
  const storedById = new Map(stored.map((o) => [o.id, o]));
  const seedIds = new Set(seed.map((s) => s.id));

  const merged = seed.map((s) => {
    const override = storedById.get(s.id);
    return override
      ? normalizeStoredObraPortfolio({ ...s, ...override, id: s.id })
      : s;
  });

  const extras = stored
    .filter((o) => o.id && !seedIds.has(o.id))
    .map(normalizeStoredObraPortfolio);
  return extras.length > 0 ? [...merged, ...extras] : merged;
}

/** El seed es la base; el CMS puede editar existentes y añadir talleres nuevos. */
export function mergeTalleresWithSeed(
  stored: Taller[] | null,
  seed: Taller[]
): Taller[] {
  if (!stored) return seed;
  const storedById = new Map(stored.map((t) => [t.id, t]));
  const seedIds = new Set(seed.map((s) => s.id));

  const merged = seed.map((s) => {
    const override = storedById.get(s.id);
    return override
      ? normalizeStoredTaller({ ...s, ...override, id: s.id })
      : s;
  });

  const extras = stored
    .filter((t) => t.id && !seedIds.has(t.id))
    .map(normalizeStoredTaller);
  return extras.length > 0 ? [...merged, ...extras] : merged;
}
