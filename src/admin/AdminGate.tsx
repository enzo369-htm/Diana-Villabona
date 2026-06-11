import { type FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  adminSessionIsUnlocked,
  sanitizePassphrase,
  setAdminSession,
} from "../lib/adminAuth";
import { AdminPage } from "../pages/AdminPage";

function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const tryDevFallback = (password: string): boolean => {
    const expected = import.meta.env.VITE_ADMIN_PASSPHRASE?.trim() ?? "";
    if (!import.meta.env.PROD && expected && password === expected) {
      setAdminSession(password);
      onSuccess();
      return true;
    }
    return false;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setWrong(false);
    setServerError(false);
    setLoading(true);

    const clean = sanitizePassphrase(value);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: clean }),
      });

      if (res.ok) {
        setAdminSession(clean);
        onSuccess();
        return;
      }

      if (res.status === 401) {
        setWrong(true);
        return;
      }

      if (res.status === 503 && import.meta.env.PROD) {
        setServerError(true);
        return;
      }

      if (tryDevFallback(clean)) return;

      setWrong(true);
    } catch {
      if (tryDevFallback(clean)) return;
      setWrong(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content page-content--pad admin-hub">
      <header className="page-header">
        <h1>Administración</h1>
        <p className="page-header__lede">
          Escribe la contraseña del panel. Solo quien la conozca y la URL{" "}
          <code>/admin</code> puede entrar; la sesión dura hasta cerrar esta pestaña
          del navegador.
        </p>
      </header>
      <form className="admin-form" onSubmit={submit} style={{ maxWidth: "24rem" }}>
        <label className="admin-field">
          Contraseña
          <input
            type="password"
            name="admin-pass"
            autoComplete="current-password"
            value={value}
            disabled={loading}
            onChange={(ev) => {
              setValue(ev.target.value);
              setWrong(false);
              setServerError(false);
            }}
          />
        </label>
        {wrong ? (
          <p className="admin-form__hint" role="alert">
            Contraseña incorrecta.
          </p>
        ) : null}
        {serverError ? (
          <p className="admin-form__hint" role="alert">
            El servidor no tiene configurada <code>CMS_ADMIN_SECRET</code> en Vercel.
          </p>
        ) : null}
        <div className="admin-form-actions">
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={loading}
          >
            {loading ? "Verificando…" : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * - VITE_ADMIN_DISABLED=true → /admin redirige al inicio.
 * - Producción: login validado en /api/auth contra CMS_ADMIN_SECRET (Vercel).
 * - Desarrollo: mismo API con `vercel dev`, o fallback a VITE_ADMIN_PASSPHRASE en .env.local.
 */
export function AdminGate() {
  if (import.meta.env.VITE_ADMIN_DISABLED === "true") {
    return <Navigate to="/" replace />;
  }

  const isProd = import.meta.env.PROD;
  const devPhrase = import.meta.env.VITE_ADMIN_PASSPHRASE?.trim() ?? "";

  const [unlocked, setUnlocked] = useState(() => adminSessionIsUnlocked());

  if (isProd) {
    if (!unlocked) {
      return <AdminLoginForm onSuccess={() => setUnlocked(true)} />;
    }
    return <AdminPage />;
  }

  if (devPhrase && !unlocked) {
    return <AdminLoginForm onSuccess={() => setUnlocked(true)} />;
  }

  return <AdminPage />;
}
