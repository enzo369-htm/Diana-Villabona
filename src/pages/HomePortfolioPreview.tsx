import { Link } from "react-router-dom";
import { getPiezasHome } from "../data/selectors";
import { useContent } from "../context/ContentContext";

const PREVIEW_COUNT = 3;

export function HomePortfolioPreview() {
  const { piezas } = useContent();
  const items = getPiezasHome(piezas).slice(0, PREVIEW_COUNT);

  if (items.length === 0) return null;

  return (
    <section
      className="home-portfolio"
      id="coleccion"
      aria-labelledby="home-portfolio-title"
    >
      <h2 id="home-portfolio-title" className="home-portfolio__title">
        Colección cerámica
      </h2>
      <div className="home-portfolio__grid" role="list">
        {items.map((pieza) => (
          <Link
            key={pieza.id}
            to={`/piezas/${pieza.id}`}
            className="home-portfolio__item"
            role="listitem"
          >
            <img
              src={pieza.imagenes[0]}
              alt={pieza.titulo}
              width={960}
              height={1280}
              loading="lazy"
              decoding="async"
            />
            <span className="home-portfolio__caption">{pieza.titulo}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
