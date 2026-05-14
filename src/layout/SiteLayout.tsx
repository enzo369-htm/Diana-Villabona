import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { INSTAGRAM_URL, SITE_NAME, whatsappLink } from "../siteConfig";

/** Coincide con `--site-min-viewport-width` en App.css (aprox. 12" en horizontal). */
const SITE_MIN_VIEWPORT_PX = 1280;

const nav: { to: string; label: string; end?: boolean }[] = [
  { to: "/", label: "Inicio", end: true },
  { to: "/piezas", label: "Piezas" },
  { to: "/bitacora", label: "Bitácora" },
  { to: "/talleres", label: "Talleres" },
  { to: "/sobre-mi", label: "Sobre mí" },
];

export function SiteLayout() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${SITE_MIN_VIEWPORT_PX - 1}px)`).matches
      : false
  );

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
  }, [pathname, hash]);

  useEffect(() => {
    const query = `(max-width: ${SITE_MIN_VIEWPORT_PX - 1}px)`;
    const mq = window.matchMedia(query);
    const sync = () => {
      const m = mq.matches;
      setNarrow(m);
      document.documentElement.classList.toggle("viewport-too-narrow", m);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      document.documentElement.classList.remove("viewport-too-narrow");
    };
  }, []);

  return (
    <div className="app">
      <div
        className="viewport-min-gate"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="viewport-gate-title"
        aria-describedby="viewport-gate-desc"
      >
        <h1 id="viewport-gate-title" className="viewport-min-gate__title">
          Pantalla demasiado pequeña
        </h1>
        <p id="viewport-gate-desc" className="viewport-min-gate__text">
          Este sitio está pensado para pantallas de al menos 12&quot; (ancho mínimo
          aproximado {SITE_MIN_VIEWPORT_PX}&nbsp;px). Ampliá la ventana del
          navegador o usá una computadora o tablet en horizontal.
        </p>
      </div>
      <div
        className="app__surface"
        inert={narrow ? true : undefined}
      >
        <header
          className={
            isHome ? "site-top" : "site-top site-top--solid"
          }
        >
          <div className="site-top__ig">
            <NavLink
              className="site-top__ig-link"
              to="/"
              end
              aria-label={`Inicio — ${SITE_NAME}`}
            >
              <span className="site-top__ig-text">{SITE_NAME}</span>
            </NavLink>
          </div>
          <nav className="site-nav" aria-label="Principal">
            {nav.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={Boolean(end)}
                className={({ isActive }) => (isActive ? "is-active" : undefined)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main key={pathname} className="page-shell">
          <Outlet />
        </main>

        {!isHome ? (
          <footer className="footer">
            <p className="footer__contact-line">
              Consultas y disponibilidad:{" "}
              <a
                href={whatsappLink("Hola Diana, me gustaría consultarte por una pieza o un taller.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </p>
            <div className="footer-links">
              <NavLink to="/" end>
                Inicio
              </NavLink>
              <NavLink to="/piezas">Piezas</NavLink>
              <NavLink to="/bitacora">Bitácora</NavLink>
              <NavLink to="/talleres">Talleres</NavLink>
              <NavLink to="/sobre-mi">Sobre mí</NavLink>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                Instagram
              </a>
            </div>
            <p className="credit">
              © {new Date().getFullYear()} Diana Villabona · Cerámica y procesos
            </p>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
