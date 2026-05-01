import { Link } from "react-router-dom";

/**
 * Panel orientativo: el CMS definitivo reemplazará la edición en código por
 * módulos conectados a API o headless. La fuente actual de contenido vive en
 * `src/data/seed.ts`.
 */
export function AdminPage() {
  return (
    <div className="page-content page-content--pad admin-hub">
      <header className="page-header">
        <h1>Administración</h1>
        <p className="page-header__lede">
          Centro de autogestión (en desarrollo). Aquí vivirán los módulos para
          que la artista actualice hero, catálogo, bitácora y talleres sin tocar
          el código.
        </p>
      </header>

      <div className="admin-modules">
        <section className="admin-module">
          <h2>Módulo 1 — Home</h2>
          <p>
            Hero manager: carga, orden y eliminación de imágenes de cabecera.
            Selectores de entrada destacada del blog y de hasta cinco piezas en
            vitrina.
          </p>
        </section>
        <section className="admin-module">
          <h2>Módulo 2 — Catálogo de piezas</h2>
          <p>
            Título, descripción, técnica, galería múltiple, estado disponible /
            vendida y opción de destacar en inicio.
          </p>
        </section>
        <section className="admin-module">
          <h2>Módulo 3 — Editor de bitácora</h2>
          <p>
            Editor enriquecido (negritas, H2, H3), bloques de imagen, vídeos
            embebidos (YouTube / Vimeo) y programación de publicación.
          </p>
        </section>
      </div>

      <p className="admin-note">
        <strong>Implementación actual:</strong> los datos semilla están en{" "}
        <code>src/data/seed.ts</code> y la configuración del sitio en{" "}
        <code>src/siteConfig.ts</code> (incluido el número de WhatsApp).
      </p>

      <Link className="btn-pill btn-pill--ghost" to="/">
        Volver al sitio
      </Link>
    </div>
  );
}
