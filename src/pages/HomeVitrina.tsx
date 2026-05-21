import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { getPiezasHome } from "../data/selectors";

export function HomeVitrina() {
  const { piezas } = useContent();
  const destacadas = useMemo(
    () => getPiezasHome(piezas).slice(0, 4),
    [piezas]
  );

  if (destacadas.length === 0) return null;

  return (
    <section
      className="home-vitrina"
      id="tienda"
      aria-labelledby="home-vitrina-title"
    >
      <div className="home-vitrina__inner">
        <h2 id="home-vitrina-title">Piezas destacadas</h2>
        <p className="home-vitrina__lede">
          Una selección del taller. Abrí la ficha para ver detalle y consultar
          disponibilidad.
        </p>

        <div className="home-vitrina__grid">
          {destacadas.map((p) => (
            <Link
              key={p.id}
              to={`/piezas/${p.id}`}
              className="home-vitrina__card"
            >
              <div className="home-vitrina__img">
                <img
                  src={p.imagenes[0]}
                  alt=""
                  width={640}
                  height={640}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="home-vitrina__tag">{p.tecnica}</span>
              <h3>{p.titulo}</h3>
              <span className="home-vitrina__cta">Ver ficha</span>
            </Link>
          ))}
        </div>

        <div className="home-vitrina__actions">
          <Link to="/piezas" className="btn-pill btn-pill--ghost">
            Ver catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
