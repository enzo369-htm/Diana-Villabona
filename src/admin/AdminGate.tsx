import { type FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { AdminPage } from "../pages/AdminPage";

const SESSION_KEY = "dvc-admin-session";

function sessionIsUnlocked(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const expected = import.meta.env.VITE_ADMIN_PASSPHRASE ?? "";
    if (value === expected) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
      return;
    }
    setWrong(true);
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
            onChange={(ev) => {
              setValue(ev.target.value);
              setWrong(false);
            }}
          />
        </label>
        {wrong ? (
          <p className="admin-form__hint" role="alert">
            Contraseña incorrecta.
          </p>
        ) : null}
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn--primary">
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Protección opcional vía variables de entorno (Vite):
 * - VITE_ADMIN_DISABLED=true → /admin redirige al inicio (útil si editas solo en local o con otro flujo).
 * - VITE_ADMIN_PASSPHRASE=texto → pantalla de clave; la frase viaja en el bundle JS, no sustituye auth del servidor.
 * Para seguridad real en producción: Basic Auth / Cloudflare Access / Netlify Identity, etc.
 */
export function AdminGate() {
  if (import.meta.env.VITE_ADMIN_DISABLED === "true") {
    return <Navigate to="/" replace />;
  }

  const phrase = import.meta.env.VITE_ADMIN_PASSPHRASE?.trim() ?? "";

  const [unlocked, setUnlocked] = useState(() =>
    phrase ? sessionIsUnlocked() : true
  );

  if (!phrase) {
    return <AdminPage />;
  }

  if (!unlocked) {
    return <AdminLoginForm onSuccess={() => setUnlocked(true)} />;
  }

  return <AdminPage />;
}
