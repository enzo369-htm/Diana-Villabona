/**
 * Convierte enlaces normales de YouTube/Vimeo en URLs embebibles (`/embed/…`).
 * YouTube y Vimeo rechazan mostrarse en un iframe si se usa la URL de la página
 * (p. ej. youtube.com/watch?v=…); solo aceptan la variante de incrustación.
 * Si la URL ya es embebible o no se reconoce, se devuelve tal cual.
 */
export function toEmbedUrl(raw: string | undefined): string {
  const url = (raw ?? "").trim();
  if (!url) return "";

  // Ya es una URL embebible.
  if (/\/embed\//.test(url) || /player\.vimeo\.com/.test(url)) return url;

  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? buildYouTube(id, u.searchParams) : url;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? buildYouTube(id, u.searchParams) : url;
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/").filter(Boolean)[1];
        return id ? buildYouTube(id, u.searchParams) : url;
      }
    }

    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^\d+$/.test(id)
        ? `https://player.vimeo.com/video/${id}`
        : url;
    }

    return url;
  } catch {
    return url;
  }
}

function buildYouTube(id: string, params: URLSearchParams): string {
  const t = params.get("t") ?? params.get("start");
  const start = t ? parseTimeToSeconds(t) : 0;
  const query = start > 0 ? `?start=${start}` : "";
  return `https://www.youtube.com/embed/${encodeURIComponent(id)}${query}`;
}

/** Acepta "90", "90s", "1m30s", "1h2m3s". */
function parseTimeToSeconds(value: string): number {
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return Number(h ?? 0) * 3600 + Number(m ?? 0) * 60 + Number(s ?? 0);
}
