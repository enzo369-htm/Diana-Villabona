import { useMemo } from "react";
import { Link } from "react-router-dom";
import { VitrinaCard } from "../components/VitrinaCard";
import { useContent } from "../context/ContentContext";
import { getPiezasHome } from "../data/selectors";

export function HomeVitrina() {
  const { piezas } = useContent();
  const destacadas = useMemo(
    () => getPiezasHome(piezas).slice(0, 4),
    [piezas]
  );

  if (destacadas.length === 0) {
    return (
      <section
        className="home-band home-vitrina"
        id="tienda"
        aria-labelledby="home-vitrina-title"
      >
        <header className="home-vitrina__head">
          <p id="home-vitrina-title" className="section-title home-band__eyebrow">
            Tienda
          </p>
          <Link to="/piezas" className="home-vitrina__catalog-link">
            Ver catálogo
            <span className="home-vitrina__catalog-link-arrow" aria-hidden>
              →
            </span>
          </Link>
        </header>
      </section>
    );
  }

  return (
    <section
      className="home-band home-vitrina"
      id="tienda"
      aria-labelledby="home-vitrina-title"
    >
      <header className="home-vitrina__head">
        <p id="home-vitrina-title" className="section-title home-band__eyebrow">
          Tienda
        </p>
        <Link to="/piezas" className="home-vitrina__catalog-link">
          Ver catálogo completo
          <span className="home-vitrina__catalog-link-arrow" aria-hidden>
            →
          </span>
        </Link>
      </header>

      <div className="home-vitrina__grid">
        {destacadas.map((p, index) => (
          <VitrinaCard key={p.id} pieza={p} index={index} />
        ))}
      </div>
    </section>
  );
}
