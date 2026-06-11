import type { VercelRequest, VercelResponse } from "@vercel/node";

const CATALOG_ID = "main";

function clean(value: string | undefined): string {
  return (value ?? "").replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").trim();
}

function assertAdminAuth(authHeader: string | undefined): boolean {
  const secret = clean(process.env.CMS_ADMIN_SECRET);
  if (!secret) return false;
  const token = authHeader?.startsWith("Bearer ")
    ? clean(authHeader.slice(7))
    : "";
  return token.length > 0 && token === secret;
}

function getSupabaseConfig(): { url: string; key: string } {
  const url = clean(process.env.SUPABASE_URL);
  const key = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el servidor.");
  }
  return { url: url.replace(/\/$/, ""), key };
}

function serviceHeaders(
  key: string,
  extra?: Record<string, string>
): Record<string, string> {
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

async function fetchCatalogPayload(): Promise<unknown | null> {
  const { url, key } = getSupabaseConfig();
  const res = await fetch(
    `${url}/rest/v1/site_catalog?id=eq.${CATALOG_ID}&select=payload`,
    { headers: { ...serviceHeaders(key), Accept: "application/json" } }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Supabase respondió ${res.status}`);
  }
  const rows = (await res.json()) as Array<{ payload?: unknown }>;
  return rows[0]?.payload ?? null;
}

async function upsertCatalogPayload(payload: unknown): Promise<void> {
  const { url, key } = getSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/site_catalog?on_conflict=id`, {
    method: "POST",
    headers: {
      ...serviceHeaders(key, { "Content-Type": "application/json" }),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      id: CATALOG_ID,
      payload,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Supabase respondió ${res.status}`);
  }
}

/** Cuántas versiones anteriores conservar. */
const BACKUP_KEEP = 30;

/**
 * Guarda la versión anterior antes de sobreescribir y poda respaldos viejos.
 * Best-effort: si algo falla, no bloquea el guardado (solo se registra).
 */
async function backupCurrentCatalog(previous: unknown): Promise<void> {
  if (previous == null) return;
  const { url, key } = getSupabaseConfig();

  try {
    const insertRes = await fetch(`${url}/rest/v1/site_catalog_backup`, {
      method: "POST",
      headers: {
        ...serviceHeaders(key, { "Content-Type": "application/json" }),
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ catalog_id: CATALOG_ID, payload: previous }),
    });
    if (!insertRes.ok) {
      console.warn("[CMS] No se pudo crear respaldo:", await insertRes.text().catch(() => ""));
      return;
    }

    // Poda: borrar todo lo que quede más allá de las últimas BACKUP_KEEP versiones.
    const oldRes = await fetch(
      `${url}/rest/v1/site_catalog_backup?select=id&catalog_id=eq.${CATALOG_ID}&order=created_at.desc&offset=${BACKUP_KEEP}`,
      { headers: { ...serviceHeaders(key), Accept: "application/json" } }
    );
    if (!oldRes.ok) return;
    const rows = (await oldRes.json()) as Array<{ id: number }>;
    if (rows.length === 0) return;

    const ids = rows.map((r) => r.id).join(",");
    await fetch(
      `${url}/rest/v1/site_catalog_backup?id=in.(${ids})`,
      { method: "DELETE", headers: serviceHeaders(key) }
    );
  } catch (err) {
    console.warn("[CMS] Error en respaldo (no crítico):", err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const payload = await fetchCatalogPayload();
      return res.status(200).json(payload ?? null);
    }

    if (req.method === "PUT") {
      if (!assertAdminAuth(req.headers.authorization)) {
        return res.status(401).json({ error: "No autorizado" });
      }
      const payload = req.body;
      if (!payload || typeof payload !== "object") {
        return res.status(400).json({ error: "Cuerpo inválido" });
      }

      const previous = await fetchCatalogPayload().catch(() => null);
      await backupCurrentCatalog(previous);
      await upsertCatalogPayload(payload);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return res.status(500).json({ error: message });
  }
}
