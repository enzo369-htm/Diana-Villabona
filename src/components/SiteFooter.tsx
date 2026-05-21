import { NavLink } from "react-router-dom";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "../siteConfig";

const FOOTER_NAME = "Diana Villabona";

const sections: { to: string; label: string; end?: boolean }[] = [
  { to: "/", label: "Inicio", end: true },
  { to: "/piezas", label: "Piezas" },
  { to: "/bitacora", label: "Bitácora" },
  { to: "/talleres", label: "Talleres" },
  { to: "/sobre-mi", label: "Sobre mí" },
];

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 6.5h16v11H4z" />
      <path d="m4 7.5 8 5.5 8-5.5" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="2.25" y="2.25" width="19.5" height="19.5" rx="5.25" ry="5.25" />
      <circle cx="12" cy="12" r="4.1" />
      <circle className="site-footer__ig-dot" cx="17.45" cy="6.55" r="1.05" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 19V6" />
      <path d="m7 11 5-5 5 5" />
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
      <div className="site-footer__surface">
        <div className="site-footer__inner">
          <header className="site-footer__head">
            <h2 className="site-footer__title">{FOOTER_NAME}</h2>
          </header>

          <div className="site-footer__body">
            <nav className="site-footer__nav" aria-label="Secciones del sitio">
              <p className="site-footer__label">Secciones</p>
              <ul className="site-footer__nav-list">
                {sections.map(({ to, label, end }) => (
                  <li key={to}>
                    <NavLink to={to} end={Boolean(end)}>
                      <span aria-hidden="true">—</span>
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="site-footer__actions">
              <div className="site-footer__actions-row">
                <a
                  className="site-footer__action-btn site-footer__action-btn--mail"
                  href={`mailto:${CONTACT_EMAIL}`}
                  aria-label={`Email — ${CONTACT_EMAIL}`}
                >
                  <MailIcon />
                </a>
                <a
                  className="site-footer__action-btn site-footer__action-btn--ig"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <NavLink
                  className="site-footer__action-btn site-footer__action-btn--cta"
                  to="/contacto"
                >
                  Ventana de contacto
                </NavLink>
              </div>

              <div className="site-footer__top-row">
                <button
                  type="button"
                  className="site-footer__action-btn site-footer__action-btn--top"
                  onClick={scrollToTop}
                  aria-label="Volver arriba"
                >
                  <ArrowUpIcon />
                </button>
              </div>
            </div>
          </div>

          <p className="site-footer__credit">
            © {year} Diana Villabona · Cerámica y procesos
          </p>
        </div>
      </div>
    </footer>
  );
}
