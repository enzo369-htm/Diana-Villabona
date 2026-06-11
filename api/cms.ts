import type { VercelRequest, VercelResponse } from "@vercel/node";

const CATALOG_ID = "main";

function assertAdminAuth(authHeader: string | undefined): boolean {
  const secret = process.env.CMS_ADMIN_SECRET?.trim();
  if (!secret) return false;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";
  return token.length > 0 && token === secret;
}

function getSupabaseConfig(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
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
