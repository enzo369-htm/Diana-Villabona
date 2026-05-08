/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Si es "true", la ruta /admin redirige al inicio. */
  readonly VITE_ADMIN_DISABLED?: string;
  /**
   * Si está definida, se pide esta clave antes del panel (queda en el JS público).
   * Para seguridad real usar auth en el hosting.
   */
  readonly VITE_ADMIN_PASSPHRASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
