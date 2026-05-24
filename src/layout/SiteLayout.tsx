import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SiteFooter } from "../components/SiteFooter";
import { SITE_NAME } from "../siteConfig";

/** Coincide con `--site-min-viewport-width` en App.css (aprox. 12" en horizontal). */
const SITE_MIN_VIEWPORT_PX = 1280;
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
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${SITE_MIN_VIEWPORT_PX - 1}px)`).matches
      : false
  );
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
          className={[
            "site-top",
            isHeroFloatNav ? "site-top--hero" : "",
            headerHidden ? "site-top--hidden" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="site-top__bar">
            <div className="site-top__inner">
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
