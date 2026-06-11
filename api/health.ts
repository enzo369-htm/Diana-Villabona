import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Diagnóstico rápido: variables de entorno del CMS (sin exponer secretos). */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const hasAdmin = Boolean(process.env.CMS_ADMIN_SECRET?.trim());
  const hasUrl = Boolean(process.env.SUPABASE_URL?.trim());
  const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

  return res.status(200).json({
    ok: hasAdmin && hasUrl && hasKey,
    env: {
      CMS_ADMIN_SECRET: hasAdmin,
      SUPABASE_URL: hasUrl,
      SUPABASE_SERVICE_ROLE_KEY: hasKey,
    },
  });
}
