import type { VercelRequest, VercelResponse } from "@vercel/node";
import { assertAdminAuth, getSupabaseAdmin } from "./_lib/supabaseAdmin";

const MAX_BYTES = 2.5 * 1024 * 1024;
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
      file?: string;
      filename?: string;
      contentType?: string;
    };

    const base64 = typeof body?.file === "string" ? body.file : "";
    const contentType =
      typeof body?.contentType === "string" ? body.contentType : "image/jpeg";
    const filename = sanitizeFilename(
      typeof body?.filename === "string" ? body.filename : "imagen.jpg"
    );

    if (!base64) {
      return res.status(400).json({ error: "Falta el archivo" });
    }

    if (!ALLOWED_TYPES.has(contentType)) {
      return res.status(400).json({ error: "Tipo de imagen no permitido" });
    }

    const buffer = Buffer.from(base64, "base64");
    if (buffer.byteLength > MAX_BYTES) {
      return res.status(400).json({ error: "La imagen supera 2,5 MB" });
    }

    const path = `uploads/${Date.now()}-${filename}`;
    const supabase = getSupabaseAdmin();
    const { error: uploadError } = await supabase.storage
      .from("cms-media")
      .upload(path, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("cms-media").getPublicUrl(path);

    return res.status(200).json({ url: publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return res.status(500).json({ error: message });
  }
}
