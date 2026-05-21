import { NavLink } from "react-router-dom";
import { CONTACT_EMAIL, INSTAGRAM_URL, SITE_NAME } from "../siteConfig";

const sections: { to: string; label: string; end?: boolean }[] = [
  { to: "/", label: "Inicio", end: true },
  { to: "/piezas", label: "Piezas" },
  { to: "/bitacora", label: "Bitácora" },
  { to: "/talleres", label: "Talleres" },
  { to: "/sobre-mi", label: "Sobre mí" },
];

function InstagramIcon() {
  return (
    <svg
      className="site-footer__ig-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      className="site-footer__top-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 5.5 5.5 12M12 5.5 18.5 12" />
      <path d="M12 5.5v13" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <p className="site-footer__brand-name">{SITE_NAME}</p>
            <p className="site-footer__brand-tag">
              Cerámica, procesos y exploración material
            </p>
          </div>

          <nav className="site-footer__nav" aria-label="Secciones del sitio">
            <p className="site-footer__label">Secciones</p>
            <ul className="site-footer__nav-list">
              {sections.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink to={to} end={Boolean(end)}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__reach">
            <p className="site-footer__label">Contacto</p>
            <a
              className="site-footer__email"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="site-footer__cta-wrap">
          <NavLink className="site-footer__cta" to="/contacto">
            Ventana de contacto
          </NavLink>
        </div>

        <div className="site-footer__bar">
          <p className="site-footer__credit">
            © {year} Diana Villabona · Cerámica y procesos
          </p>

          <div className="site-footer__actions">
            <a
              className="site-footer__icon-btn"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <button
              type="button"
              className="site-footer__icon-btn site-footer__icon-btn--top"
              onClick={scrollToTop}
              aria-label="Volver arriba"
            >
              <ArrowUpIcon />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
