import { Link, useParams } from "react-router-dom";
import { OBRAS_PORTFOLIO_IMAGENES } from "../types/content";
import { getObraPortfolioById } from "../data/selectors";
import { useContent } from "../context/ContentContext";

export function PortfolioObraPage() {
  const { obrasPortfolio } = useContent();
  const { id } = useParams<{ id: string }>();
  const obra = id ? getObraPortfolioById(obrasPortfolio, id) : undefined;

  if (!obra) {
    return (
      <div className="page-content page-content--pad">
        <p>No encontramos esta obra.</p>
        <Link to="/portfolio">Volver al portfolio</Link>
      </div>
    );
  }

  const imagenes = obra.imagenes
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, OBRAS_PORTFOLIO_IMAGENES);

  return (
    <article className="page-content page-content--pad portfolio-obra">
      <nav className="breadcrumb" aria-label="Migas">
        <Link to="/portfolio">Portfolio</Link>
        <span aria-hidden> / </span>
        <span>{obra.titulo}</span>
      </nav>

      <header className="portfolio-obra__head">
        <h1 className="portfolio-obra__title">{obra.titulo}</h1>
        {obra.texto ? <p className="portfolio-obra__text">{obra.texto}</p> : null}
      </header>

      {imagenes.length > 0 ? (
        <div className="portfolio-obra__grid" role="list">
          {imagenes.map((src, index) => (
            <div key={`${src.slice(0, 40)}-${index}`} className="portfolio-obra__cell" role="listitem">
              <img src={src} alt="" width={960} height={1200} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
