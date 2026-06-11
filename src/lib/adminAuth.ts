const SESSION_KEY = "dvc-admin-session";
const PASSPHRASE_KEY = "dvc-admin-pass";

export function setAdminSession(passphrase: string): void {
  sessionStorage.setItem(SESSION_KEY, "1");
  sessionStorage.setItem(PASSPHRASE_KEY, passphrase);
}

export function unlockAdminWithoutPassphrase(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(PASSPHRASE_KEY);
}

export function getAdminPassphrase(): string | null {
  return sessionStorage.getItem(PASSPHRASE_KEY);
}

export function adminSessionIsUnlocked(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
