import type { VercelRequest, VercelResponse } from "@vercel/node";
import { assertAdminAuth } from "./lib/supabaseAdmin";
import {
  fetchCatalogPayload,
  upsertCatalogPayload,
} from "./lib/supabaseRest";

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
