import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Quita caracteres invisibles (ancho cero, BOM, NBSP) y recorta espacios. */
function clean(value: string | undefined): string {
  return (value ?? "").replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").trim();
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  const secret = clean(process.env.CMS_ADMIN_SECRET);
  if (!secret) {
    return res.status(503).json({ error: "CMS no configurado en el servidor" });
  }

  const body = req.body as { password?: string };
  const password = clean(typeof body?.password === "string" ? body.password : "");

  if (!password || password !== secret) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  return res.status(200).json({ ok: true });
}
