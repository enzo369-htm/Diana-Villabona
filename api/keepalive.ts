import type { VercelRequest, VercelResponse } from "@vercel/node";

const CATALOG_ID = "main";

function clean(value: string | undefined): string {
  return (value ?? "").replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").trim();
}

function assertCronAuth(authHeader: string | undefined): boolean {
  const secret = clean(process.env.CRON_SECRET);
  if (!secret) return true;
  const token = authHeader?.startsWith("Bearer ")
    ? clean(authHeader.slice(7))
    : "";
  return token.length > 0 && token === secret;
}

function getSupabaseConfig(): { url: string; key: string } {
  const rawUrl = clean(process.env.SUPABASE_URL);
  const key = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!rawUrl || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el servidor.");
  }
  let url = rawUrl.replace(/\/+$/, "");
  try {
    url = new URL(rawUrl).origin;
  } catch {
    /* si no parsea, se usa la versión saneada */
  }
  return { url, key };
}

function serviceHeaders(
  key: string,
  extra?: Record<string, string>
): Record<string, string> {
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

/** Ping mínimo a Supabase para evitar pausa por inactividad (plan gratis). */
async function pingSupabase(): Promise<void> {
  const { url, key } = getSupabaseConfig();
  const res = await fetch(
    `${url}/rest/v1/site_catalog?id=eq.${CATALOG_ID}&select=id`,
    { headers: { ...serviceHeaders(key), Accept: "application/json" } }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Supabase respondió ${res.status}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  if (!assertCronAuth(req.headers.authorization)) {
    return res.status(401).json({ ok: false, error: "No autorizado" });
  }

  try {
    await pingSupabase();
    return res.status(200).json({ ok: true, at: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return res.status(503).json({ ok: false, error: message });
  }
}
