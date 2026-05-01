import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { whatsappLink } from "../siteConfig";
import { getPiezaById } from "../data/selectors";

export function PiezaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const pieza = id ? getPiezaById(id) : undefined;
  const [zoomed, setZoomed] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const mainSrc = pieza?.imagenes[active] ?? "";
  const wa = useMemo(() => {
    if (!pieza) return "#";
    return whatsappLink(
      `Hola Diana, me interesa obtener más información sobre la pieza: ${pieza.titulo}`
    );
  }, [pieza]);

  if (!pieza) {
    return (
      <div className="page-content page-content--pad">
        <p>No encontramos esta pieza.</p>
        <Link to="/piezas">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="page-content page-content--pad pieza-detail">
      <nav className="breadcrumb" aria-label="Migas">
        <Link to="/piezas">Piezas</Link>
        <span aria-hidden> / </span>
        <span>{pieza.titulo}</span>
      </nav>

      <div className="pieza-detail__grid">
        <div className="pieza-detail__gallery">
          <button
            type="button"
            className={
              zoomed === mainSrc
                ? "pieza-detail__main pieza-detail__main--zoom"
                : "pieza-detail__main"
            }
            onClick={() =>
              setZoomed((z) => (z === mainSrc ? null : mainSrc))
            }
            aria-pressed={zoomed === mainSrc}
            aria-label={
              zoomed === mainSrc
                ? "Reducir imagen"
                : "Ampliar imagen principal"
            }
          >
            <img
              src={mainSrc}
              alt=""
              width={1000}
              height={1000}
              loading="eager"
              decoding="async"
            />
          </button>
          {pieza.imagenes.length > 1 ? (
            <ul className="pieza-detail__thumbs" role="list">
              {pieza.imagenes.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    className={
                      i === active ? "pieza-thumb pieza-thumb--on" : "pieza-thumb"
                    }
                    onClick={() => {
                      setActive(i);
                      setZoomed(null);
                    }}
                    aria-label={`Ver foto ${i + 1}`}
                  >
                    <img src={src} alt="" width={120} height={120} loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="pieza-detail__info">
          <p className="pieza-detail__tag">{pieza.tecnica}</p>
          <h1>{pieza.titulo}</h1>
          <p className="pieza-detail__avail">
            {pieza.disponible ? "Disponible" : "Vendida"}
          </p>
          <p>{pieza.descripcion}</p>
          <dl className="pieza-detail__spec">
            <div>
              <dt>Dimensiones</dt>
              <dd>{pieza.dimensiones}</dd>
            </div>
            <div>
              <dt>Técnica</dt>
              <dd>{pieza.tecnica}</dd>
            </div>
          </dl>
          {pieza.historia ? (
            <>
              <h2 className="pieza-detail__h2">Historia de la pieza</h2>
              <p>{pieza.historia}</p>
            </>
          ) : null}
          {pieza.disponible ? (
            <a className="btn-pill btn-pill--accent" href={wa} target="_blank" rel="noopener noreferrer">
              Consultar disponibilidad
            </a>
          ) : (
            <p className="pieza-detail__note">
              Esta pieza ya encontró hogar. Explora el catálogo por piezas
              disponibles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
