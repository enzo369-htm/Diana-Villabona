import type { VercelRequest, VercelResponse } from "@vercel/node";
import { assertAdminAuth, getSupabaseAdmin } from "./_lib/supabaseAdmin";

const CATALOG_ID = "main";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("site_catalog")
        .select("payload")
        .eq("id", CATALOG_ID)
        .maybeSingle();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data?.payload ?? null);
    }

    if (req.method === "PUT") {
      if (!assertAdminAuth(req.headers.authorization)) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const payload = req.body;
      if (!payload || typeof payload !== "object") {
        return res.status(400).json({ error: "Cuerpo inválido" });
      }

      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from("site_catalog").upsert({
        id: CATALOG_ID,
        payload,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return res.status(500).json({ error: message });
  }
}
