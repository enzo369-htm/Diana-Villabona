import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Ruta legacy (base64). Preferir /api/upload-sign + subida directa a Supabase. */
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

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
      return res.status(400).json({
        error: `La imagen supera ${MAX_BYTES / (1024 * 1024)} MB`,
      });
    }

    const path = `uploads/${Date.now()}-${filename}`;
    const { url, key } = getSupabaseConfig();

    const uploadRes = await fetch(
      `${url}/storage/v1/object/cms-media/${path}`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": contentType,
          "x-upsert": "false",
        },
        body: buffer,
      }
    );

    if (!uploadRes.ok) {
      const detail = await uploadRes.text().catch(() => "");
      return res
        .status(500)
        .json({ error: detail || `Storage respondió ${uploadRes.status}` });
    }

    const publicUrl = `${url}/storage/v1/object/public/cms-media/${path}`;
    return res.status(200).json({ url: publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return res.status(500).json({ error: message });
  }
}
