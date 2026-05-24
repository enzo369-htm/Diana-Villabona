import { useMemo, useState } from "react";
import {
  filtrarPiezas,
  tecnicasDisponibles,
  type FiltroTecnica,
} from "../data/selectors";
import { VitrinaCard } from "../components/VitrinaCard";
import { useContent } from "../context/ContentContext";

export function PiezasPage() {
  const { piezas } = useContent();
  const [filtro, setFiltro] = useState<FiltroTecnica>("Todas");
  const lista = useMemo(
    () => filtrarPiezas(piezas, filtro),
    [piezas, filtro]
  );

  return (
    <section
      className="home-band piezas-catalog"
      aria-labelledby="piezas-catalog-title"
    >
      <header className="home-vitrina__head piezas-catalog__head">
        <p id="piezas-catalog-title" className="home-band__eyebrow">
          Tienda
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

      {lista.length === 0 ? (
        <p className="piezas-catalog__empty">
          No hay piezas con esa técnica. Probá otro filtro.
        </p>
      ) : (
        <div className="home-vitrina__grid piezas-catalog__grid" role="list">
          {lista.map((p, index) => (
            <VitrinaCard key={p.id} pieza={p} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
