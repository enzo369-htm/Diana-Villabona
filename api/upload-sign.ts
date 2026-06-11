import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Fotos van directo a Supabase (no pasan por el cuerpo de la función). */
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

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
    const { url, key } = getSupabaseConfig();

    const signRes = await fetch(
      `${url}/storage/v1/object/upload/sign/cms-media/${path}`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: "{}",
      }
    );

    if (!signRes.ok) {
      const detail = await signRes.text().catch(() => "");
      return res
        .status(500)
        .json({ error: detail || `Storage respondió ${signRes.status}` });
    }

    const data = (await signRes.json()) as {
      signedUrl?: string;
      signedURL?: string;
      url?: string;
    };
    const relative = data.signedUrl ?? data.signedURL ?? data.url;
    if (!relative) {
      return res.status(500).json({ error: "Storage no devolvió URL firmada." });
    }

    const signedUrl = relative.startsWith("http")
      ? relative
      : `${url}/storage/v1${relative}`;
    const publicUrl = `${url}/storage/v1/object/public/cms-media/${path}`;

    return res.status(200).json({ signedUrl, publicUrl, path });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return res.status(500).json({ error: message });
  }
}
