import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  const secret = process.env.CMS_ADMIN_SECRET?.trim();
  if (!secret) {
    return res.status(503).json({ error: "CMS no configurado en el servidor" });
  }

  const body = req.body as { password?: string };
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || password !== secret) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  return res.status(200).json({ ok: true });
}
