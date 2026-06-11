import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el servidor.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function assertAdminAuth(authHeader: string | undefined): boolean {
  const secret = process.env.CMS_ADMIN_SECRET?.trim();
  if (!secret) return false;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";
  return token.length > 0 && token === secret;
}
