import { NavLink } from "react-router-dom";
import { CONTACT_EMAIL, INSTAGRAM_URL, NAV_ITEMS } from "../siteConfig";

const FOOTER_QUOTE =
  "Lo más hermoso y profundo de la cerámica es dejarse usar como medio para que la naturaleza se exprese a sí misma.";

const sections = NAV_ITEMS;

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
          <div className="site-footer__body">
            <blockquote className="site-footer__quote">
              <p>{FOOTER_QUOTE}</p>
            </blockquote>

            <div className="site-footer__aside">
              <nav className="site-footer__nav" aria-label="Secciones del sitio">
                <ul className="site-footer__nav-list">
                  {sections.map(({ to, label }) => (
                    <li key={to}>
                      <NavLink to={to}>
                        <span aria-hidden="true">—</span>
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="site-footer__actions">
                <p className="site-footer__actions-label">Contacto</p>
                <NavLink to="/contacto" className="site-footer__contact-link">
                  Ventana de contacto
                  <span className="site-footer__contact-link-arrow" aria-hidden>
                    →
                  </span>
                </NavLink>
                <div className="site-footer__social" role="group" aria-label="Redes y correo">
                  <a
                    className="site-footer__social-btn"
                    href={`mailto:${CONTACT_EMAIL}`}
                    aria-label={`Email — ${CONTACT_EMAIL}`}
                  >
                    <MailIcon />
                  </a>
                  <a
                    className="site-footer__social-btn"
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                </div>
                <button
                  type="button"
                  className="site-footer__top-link"
                  onClick={scrollToTop}
                >
                  <span>Subir</span>
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
