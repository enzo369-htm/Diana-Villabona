import { useMemo } from "react";
import { talleresParaGrilla } from "../data/talleresSelectors";
import { useContent } from "../context/ContentContext";
import { whatsappLink } from "../siteConfig";
import type { Taller } from "../types/content";
import { TalleresIntro } from "./TalleresIntro";

function tallerExplorarHref(t: Taller): string {
  const link = t.enlace?.trim();
  if (link) return link;
  return whatsappLink(`Hola Diana, me interesa el taller «${t.titulo}».`);
}

export function TalleresPage() {
  const { talleres } = useContent();
  const grilla = useMemo(() => talleresParaGrilla(talleres), [talleres]);
  const inscripcion = whatsappLink(
    "Hola Diana, me interesa inscribirme o pedir información sobre un taller."
  );

  return (
    <>
      <TalleresIntro />

      <div className="page-content page-content--pad page-content--talleres">
        <header className="page-header page-header--talleres">
          <p className="page-header__lede">
            Experiencias en el taller: fechas actuales y archivo de encuentros
            pasados.
          </p>
        </header>

        <section className="talleres-section" aria-label="Encuentros">
          {grilla.length === 0 ? (
            <p>Pronto publicaremos nuevas fechas.</p>
          ) : (
            <ul className="talleres-grid" role="list">
              {grilla.map((t) => (
                <li
                  key={t.id}
                  className={`talleres-card talleres-card--${t.estado}`}
                >
                  <article className="talleres-card__inner">
                    <h3 className="talleres-card__title">{t.titulo}</h3>
                    <p className="talleres-card__desc">{t.descripcion}</p>
                    <a
                      className="talleres-card__cta"
                      href={tallerExplorarHref(t)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Explorar
                      <span className="talleres-card__cta-arrow" aria-hidden>
                        →
                      </span>
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="talleres-actions">
          <a
            className="btn-pill btn-pill--accent"
            href={inscripcion}
            target="_blank"
            rel="noopener noreferrer"
          >
            Inscripción por WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
