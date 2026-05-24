import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Pieza } from "../types/content";

type VitrinaCardProps = {
  pieza: Pieza;
  index?: number;
};

export function VitrinaCard({ pieza, index }: VitrinaCardProps) {
  return (
    <Link
      to={`/piezas/${pieza.id}`}
      className={
        pieza.disponible
          ? "home-vitrina__card"
          : "home-vitrina__card home-vitrina__card--sold"
      }
      style={
        index !== undefined
          ? ({ "--vitrina-i": index % 4 } as CSSProperties)
          : undefined
      }
    >
      <img
        src={pieza.imagenes[0]}
        alt={pieza.titulo}
        width={960}
        height={1280}
        loading="lazy"
        decoding="async"
      />
      <span className="home-vitrina__tag">{pieza.tecnica}</span>
      <div className="home-vitrina__copy">
        <h3>{pieza.titulo}</h3>
        {pieza.disponible ? (
          <span className="home-vitrina__cta">
            Ver ficha
            <span className="home-vitrina__cta-arrow" aria-hidden>
              →
            </span>
          </span>
        ) : (
          <span className="home-vitrina__cta home-vitrina__cta--sold">
            Vendida
          </span>
        )}
      </div>
    </Link>
  );
}
