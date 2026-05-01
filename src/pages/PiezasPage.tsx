import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { piezas } from "../data/seed";
import {
  filtrarPiezas,
  tecnicasDisponibles,
  type FiltroTecnica,
} from "../data/selectors";

export function PiezasPage() {
  const [filtro, setFiltro] = useState<FiltroTecnica>("Todas");
  const lista = useMemo(
    () => filtrarPiezas(piezas, filtro),
    [filtro]
  );

  return (
    <div className="page-content page-content--pad">
      <header className="page-header">
        <h1>Piezas</h1>
        <p className="page-header__lede">
          Exhibición y venta consultiva. Filtra por técnica y abre la ficha para
          ver galería, medidas e historia. La disponibilidad se confirma por
          WhatsApp.
        </p>
      </header>

      <div className="piezas-filters" role="group" aria-label="Filtrar por técnica">
        {tecnicasDisponibles.map((t) => (
          <button
            key={t}
            type="button"
            className={
              filtro === t ? "piezas-filter piezas-filter--on" : "piezas-filter"
            }
            onClick={() => setFiltro(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="piezas-grid" role="list">
        {lista.map((p) => (
          <li key={p.id}>
            <Link to={`/piezas/${p.id}`} className="piezas-card">
              <div className="piezas-card__img">
                <img
                  src={p.imagenes[0]}
                  alt=""
                  width={640}
                  height={640}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="piezas-card__meta">
                <span className="piezas-card__tag">{p.tecnica}</span>
                <h2>{p.titulo}</h2>
                <p className="piezas-card__status">
                  {p.disponible ? "Disponible" : "Vendida"}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
