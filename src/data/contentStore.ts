import type { Pieza, Post } from "../types/content";

const STORAGE_KEY = "dvc-cms-catalogo-v1";

export type StoredCms = {
  piezas: Pieza[];
  posts: Post[];
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

export function loadCms(): StoredCms | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<{
      piezas: Pieza[];
      posts: unknown[];
    }>;
    if (!Array.isArray(data.piezas) || !Array.isArray(data.posts)) return null;
    return {
      piezas: data.piezas,
      posts: data.posts.map(normalizeStoredPost),
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
