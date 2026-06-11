import type { VercelRequest, VercelResponse } from "@vercel/node";
import { assertAdminAuth } from "./lib/supabaseAdmin";
import {
  createSignedUploadUrl,
  publicMediaUrl,
} from "./lib/supabaseRest";

/** Fotos van directo a Supabase (no pasan por el cuerpo de la función). */
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "imagen";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!assertAdminAuth(req.headers.authorization)) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const body = req.body as {
      filename?: string;
      contentType?: string;
      size?: number;
    };

    const contentType =
      typeof body?.contentType === "string" ? body.contentType : "image/jpeg";
    const filename = sanitizeFilename(
      typeof body?.filename === "string" ? body.filename : "imagen.jpg"
    );
    const size = typeof body?.size === "number" ? body.size : 0;

    if (size <= 0) {
      return res.status(400).json({ error: "Tamaño de archivo inválido" });
    }

    if (size > MAX_BYTES) {
      return res.status(400).json({
        error: `La imagen supera ${MAX_BYTES / (1024 * 1024)} MB`,
      });
    }

    if (!ALLOWED_TYPES.has(contentType)) {
      return res.status(400).json({ error: "Tipo de imagen no permitido" });
    }

    const path = `uploads/${Date.now()}-${filename}`;
    const { signedUrl } = await createSignedUploadUrl(path);

    return res.status(200).json({
      signedUrl,
      publicUrl: publicMediaUrl(path),
      path,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return res.status(500).json({ error: message });
  }
}
