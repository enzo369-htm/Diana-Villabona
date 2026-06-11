import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Quita caracteres invisibles (ancho cero, BOM, NBSP) y recorta espacios. */
function clean(value: string | undefined): string {
  return (value ?? "").replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").trim();
}

/** Códigos de los primeros caracteres (para detectar invisibles ocultos). */
function firstCharCodes(value: string, n = 4): number[] {
  return Array.from(value.slice(0, n)).map((c) => c.codePointAt(0) ?? 0);
}

/**
 * Diagnóstico del CMS. SUPABASE_URL no es secreto (se usa en el cliente), así que
 * se muestra. La service role key NO se expone: solo longitud y códigos iniciales.
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const rawUrl = process.env.SUPABASE_URL ?? "";
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const rawSecret = process.env.CMS_ADMIN_SECRET ?? "";

  const cleanUrl = clean(rawUrl).replace(/\/$/, "");

  return res.status(200).json({
    ok: Boolean(clean(rawUrl) && clean(rawKey) && clean(rawSecret)),
    supabaseUrl: {
      raw: rawUrl,
      cleaned: cleanUrl,
      rawLength: rawUrl.length,
      cleanedLength: cleanUrl.length,
      hadInvisibleOrSpace: rawUrl !== cleanUrl,
      firstCharCodes: firstCharCodes(rawUrl),
    },
    serviceRoleKey: {
      present: Boolean(rawKey),
      rawLength: rawKey.length,
      cleanedLength: clean(rawKey).length,
      hadInvisibleOrSpace: rawKey !== clean(rawKey),
      firstCharCodes: firstCharCodes(rawKey, 2),
    },
    adminSecret: {
      present: Boolean(rawSecret),
      rawLength: rawSecret.length,
      cleanedLength: clean(rawSecret).length,
      hadInvisibleOrSpace: rawSecret !== clean(rawSecret),
    },
  });
}
