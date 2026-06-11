const SESSION_KEY = "dvc-admin-session";
const PASSPHRASE_KEY = "dvc-admin-pass";

/**
 * Quita caracteres invisibles (espacios de ancho cero, BOM) y recorta espacios.
 * Evita que un carácter oculto pegado por error rompa el encabezado Authorization
 * (que solo admite bytes 0–255).
 */
export function sanitizePassphrase(value: string): string {
  return value.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").trim();
}

export function setAdminSession(passphrase: string): void {
  sessionStorage.setItem(SESSION_KEY, "1");
  sessionStorage.setItem(PASSPHRASE_KEY, sanitizePassphrase(passphrase));
}

export function unlockAdminWithoutPassphrase(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(PASSPHRASE_KEY);
}

export function getAdminPassphrase(): string | null {
  const raw = sessionStorage.getItem(PASSPHRASE_KEY);
  return raw == null ? null : sanitizePassphrase(raw);
}

export function adminSessionIsUnlocked(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
