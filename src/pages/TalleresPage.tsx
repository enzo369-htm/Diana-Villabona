import { talleres } from "../data/seed";
import { whatsappLink } from "../siteConfig";
import { TalleresIntro } from "./TalleresIntro";

function EstadoBadge({ estado }: { estado: string }) {
  const labels: Record<string, string> = {
    proximo: "Próximo",
    en_curso: "En curso",
    archivo: "Archivo",
  };
  return <span className="taller-badge">{labels[estado] ?? estado}</span>;
}

export function TalleresPage() {
  const proximos = talleres.filter((t) => t.estado !== "archivo");
  const archivo = talleres.filter((t) => t.estado === "archivo");
  const inscripcion = whatsappLink(
    "Hola Diana, me interesa inscribirme o pedir información sobre un taller."
  );

  return (
    <>
      <TalleresIntro />

      <div className="page-content page-content--pad page-content--talleres">
        <header className="page-header page-header--talleres">
          <p className="page-header__lede">
            Experiencias en el estudio: fechas actuales y archivo de encuentros
            pasados. La inscripción es por WhatsApp para mantener el diálogo
            cercano.
          </p>
        </header>

        <section className="talleres-section" aria-labelledby="t-prox">
          <h2 id="t-prox" className="talleres-section__heading">
            Actuales y próximos
          </h2>
          {proximos.length === 0 ? (
            <p>Pronto publicaremos nuevas fechas.</p>
          ) : (
            <ul className="talleres-list" role="list">
              {proximos.map((t) => (
                <li key={t.id} className={`talleres-card talleres-card--${t.estado}`}>
                  <div className="talleres-card__inner">
                    <div className="talleres-card__meta">
                      <EstadoBadge estado={t.estado} />
                      <time dateTime={t.fecha}>{t.fecha}</time>
                    </div>
                    <h3>{t.titulo}</h3>
                    <p className="talleres-card__desc">{t.descripcion}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="talleres-section" aria-labelledby="t-arch">
          <h2 id="t-arch" className="talleres-section__heading">
            Archivo
          </h2>
          {archivo.length === 0 ? (
            <p>Sin talleres en archivo por ahora.</p>
          ) : (
            <ul className="talleres-list talleres-list--archive" role="list">
              {archivo.map((t) => (
                <li key={t.id} className={`talleres-card talleres-card--${t.estado}`}>
                  <div className="talleres-card__inner">
                    <div className="talleres-card__meta">
                      <EstadoBadge estado={t.estado} />
                      <time dateTime={t.fecha}>{t.fecha}</time>
                    </div>
                    <h3>{t.titulo}</h3>
                    <p className="talleres-card__desc">{t.descripcion}</p>
                  </div>
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
