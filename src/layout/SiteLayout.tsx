import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SiteFooter } from "../components/SiteFooter";
import { SITE_NAME } from "../siteConfig";

const SCROLL_DELTA = 8;
const SCROLL_MIN_TO_HIDE = 72;
/** En home: solo arriba del todo el nav flota sobre el hero (sin barra). */
const HERO_FLOAT_MAX = 40;

const nav: { to: string; label: string; end?: boolean }[] = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/piezas", label: "Tienda" },
  { to: "/bitacora", label: "Blog" },
  { to: "/talleres", label: "Talleres" },
  { to: "/sobre-mi", label: "Sobre mí" },
];

export function SiteLayout() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";
  const [headerHidden, setHeaderHidden] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  const isHeroFloatNav =
    isHome && !headerHidden && scrollY <= HERO_FLOAT_MAX;

  useLayoutEffect(() => {
    setHeaderHidden(false);
    setScrollY(0);
    lastScrollY.current = 0;
    if (hash) {
      const id = hash.replace(/^#/, "");
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    setScrollY(window.scrollY);
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;

        setScrollY(y);

        if (y <= 0) {
          setHeaderHidden(false);
        } else if (delta > SCROLL_DELTA && y > SCROLL_MIN_TO_HIDE) {
          setHeaderHidden(true);
        } else if (delta < -SCROLL_DELTA) {
          setHeaderHidden(false);
        }

        lastScrollY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <div className="app">
      <div className="app__surface">
        <header
          className={[
            "site-top",
            isHeroFloatNav ? "site-top--hero" : "",
            headerHidden ? "site-top--hidden" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="site-top__bar">
            <NavLink
              className="site-top__brand"
              to="/"
              end
              aria-label={`Inicio — ${SITE_NAME}`}
            >
              <span className="site-top__brand-text">{SITE_NAME}</span>
            </NavLink>
            <nav className="site-nav" aria-label="Principal">
              <ul className="site-nav__list">
                {nav.map(({ to, label, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={Boolean(end)}
                      className={({ isActive }) =>
                        isActive ? "site-nav__link is-active" : "site-nav__link"
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main key={pathname} className="page-shell">
          <Outlet />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
