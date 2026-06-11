/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Si es "true", la ruta /admin redirige al inicio. */
  readonly VITE_ADMIN_DISABLED?: string;
  /**
   * Si está definida, se pide esta clave antes del panel (queda en el JS público).
   * Debe coincidir con CMS_ADMIN_SECRET en el servidor para subir imágenes y guardar.
   */
  readonly VITE_ADMIN_PASSPHRASE?: string;
  /** URL del proyecto Supabase (lectura pública del catálogo). */
  readonly VITE_SUPABASE_URL?: string;
  /** Clave anon de Supabase (solo lectura con RLS). */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
