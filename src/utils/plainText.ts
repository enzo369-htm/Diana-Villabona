/** Escapa texto para insertarlo en HTML (evita que < o & activen etiquetas). */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Convierte texto plano (párrafos separados por línea en blanco) en HTML seguro.
 * Saltos de línea dentro del mismo párrafo se muestran como <br/>.
 */
export function plainTextToSafeHtml(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const blocks = trimmed.split(/\n\n+/);
  return blocks
    .map((block) => {
      const lines = block.split("\n");
      const inner = lines.map((line) => escapeHtml(line)).join("<br/>");
      return `<p>${inner}</p>`;
    })
    .join("");
}
