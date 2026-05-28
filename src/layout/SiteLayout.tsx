import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SiteFooter } from "../components/SiteFooter";
import { NAV_ITEMS, SITE_NAME } from "../siteConfig";

const SCROLL_DELTA = 8;
const SCROLL_MIN_TO_HIDE = 72;
/** En home: nav flotante solo en el tope absoluto del hero. */
const HOME_HERO_NAV_TOP = 8;

const nav = NAV_ITEMS;

export function SiteLayout() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";
  const [headerHidden, setHeaderHidden] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  const isHeroFloatNav =
    isHome && !headerHidden && scrollY <= HOME_HERO_NAV_TOP;

  useEffect(() => {
    document.documentElement.classList.toggle("is-home", isHome);
    return () => document.documentElement.classList.remove("is-home");
  }, [isHome]);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", mobileNavOpen);
    return () => document.documentElement.classList.remove("nav-open");
  }, [mobileNavOpen]);

  useLayoutEffect(() => {
    setMobileNavOpen(false);
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

        if (isHome) {
          if (y <= 0) {
            setHeaderHidden(false);
          } else if (delta > SCROLL_DELTA) {
            setHeaderHidden(true);
          } else if (delta < -SCROLL_DELTA) {
            setHeaderHidden(false);
          }
        } else if (y <= 0) {
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
  }, [pathname, isHome]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (headerHidden) setMobileNavOpen(false);
  }, [headerHidden]);

  const closeMobileNav = () => setMobileNavOpen(false);

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
              onClick={closeMobileNav}
            >
              <span className="site-top__brand-text">{SITE_NAME}</span>
            </NavLink>
            <button
              type="button"
              className="site-nav-toggle"
              aria-expanded={mobileNavOpen}
              aria-controls="site-nav-panel"
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              <span className="site-nav-toggle__icon" aria-hidden="true" />
              <span className="site-nav-toggle__label">
                {mobileNavOpen ? "Cerrar" : "Menú"}
              </span>
            </button>
            {mobileNavOpen ? (
              <button
                type="button"
                className="site-nav-backdrop"
                aria-label="Cerrar menú"
                onClick={closeMobileNav}
              />
            ) : null}
            <nav
              id="site-nav-panel"
              className={[
                "site-nav",
                mobileNavOpen ? "site-nav--open" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label="Principal"
            >
              <ul className="site-nav__list">
                {nav.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        isActive ? "site-nav__link is-active" : "site-nav__link"
                      }
                      onClick={closeMobileNav}
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
