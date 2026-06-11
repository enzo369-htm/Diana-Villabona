import { type FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { adminSessionIsUnlocked, setAdminSession } from "../lib/adminAuth";
import { AdminPage } from "../pages/AdminPage";

function AdminPassphraseMissing() {
  return (
    <div className="page-content page-content--pad admin-hub">
      <header className="page-header">
        <h1>Administración</h1>
        <p className="page-header__lede">
          En producción hace falta definir la contraseña del panel en el hosting.
          Vite solo la incluye si existe al <strong>construir</strong> el sitio.
        </p>
      </header>
      <div className="admin-deploy-help">
        <p>
          En <strong>Vercel</strong>: proyecto → <strong>Settings</strong> →{" "}
          <strong>Environment Variables</strong> → añade:
        </p>
        <ul>
          <li>
            Nombre: <code>VITE_ADMIN_PASSPHRASE</code>
          </li>
          <li>
            Valor: tu contraseña (la misma que en <code>.env.local</code>)
          </li>
          <li>
            Entorno: al menos <strong>Production</strong> (y Preview si quieres la
            misma en previews)
          </li>
        </ul>
        <p>
          Luego <strong>Redeploy</strong> el último despliegue (Deployments → ⋮ →
          Redeploy). Sin un nuevo build, la variable no entra en el JavaScript.
        </p>
      </div>
      <p style={{ marginTop: "1.25rem" }}>
        <Link className="btn-pill btn-pill--ghost" to="/">
          Volver al sitio
        </Link>
      </p>
    </div>
  );
}

function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const expected = import.meta.env.VITE_ADMIN_PASSPHRASE ?? "";
    if (value === expected) {
      setAdminSession(value);
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
  const isProd = import.meta.env.PROD;

  const [unlocked, setUnlocked] = useState(() =>
    phrase ? adminSessionIsUnlocked() : true
  );

  if (!phrase) {
    if (isProd) {
      return <AdminPassphraseMissing />;
    }
    return <AdminPage />;
  }

  if (!unlocked) {
    return <AdminLoginForm onSuccess={() => setUnlocked(true)} />;
  }

  return <AdminPage />;
}
