import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function hasSupabaseBrowserEnv(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key);
}

/** En producción usa la API de Vercel; en local, Supabase directo si hay variables. */
export function isRemoteCmsEnabled(): boolean {
  if (import.meta.env.PROD) return true;
  return hasSupabaseBrowserEnv();
}

export function getSupabaseBrowser(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    throw new Error("Supabase no configurado en el cliente.");
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
