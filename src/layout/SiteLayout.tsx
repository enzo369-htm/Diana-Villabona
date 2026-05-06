import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { INSTAGRAM_URL, SITE_NAME, whatsappLink } from "../siteConfig";

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

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
  }, [pathname, hash]);

  return (
    <div className="app">
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
          <NavLink to="/admin" className="footer__admin">
            Administración
          </NavLink>
        </div>
        <p className="credit">
          © {new Date().getFullYear()} Diana Villabona · Cerámica y procesos
        </p>
      </footer>
    </div>
  );
}
