import { Link } from "react-router-dom";
import { IMAGES, VIIDEO } from "../images";
import { getPiezasHome, getPostDestacado } from "../data/selectors";

/**
 * Mosaico de 5 fotos: grid 2×2 + columna derecha a todo alto.
 */
function HeroImg({
  src,
  priority,
  className,
}: {
  src: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={className ? `hero__cell ${className}` : "hero__cell"}>
      <img
        src={src}
        alt=""
        width={600}
        height={600}
        loading="eager"
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
    </div>
  );
}

function HeroMosaic() {
  return (
    <div
      className="hero__mosaic hero__mosaic--grid-5"
      role="presentation"
      aria-hidden
    >
      <HeroImg src={IMAGES.hero5} priority />
      <HeroImg src={IMAGES.hero2} />
      <HeroImg src={IMAGES.hero6} />
      <HeroImg src={IMAGES.hero7} />
      <HeroImg src={IMAGES.hero} />
    </div>
  );
}

export function HomePage() {
  const vitrina = getPiezasHome();
  const bita = getPostDestacado();

  return (
    <>
      <section className="hero" id="inicio" aria-label="Bienvenida">
        <div className="hero__image-wrap" aria-hidden>
          <HeroMosaic />
        </div>
      </section>

      <section className="ceramica-swiss" id="ceramica" aria-label="Contexto">
        <div className="ceramica-swiss__inner">
          <div className="ceramica-swiss__head">
            <p className="ceramica-swiss__name">Diana Villabona</p>
            <div className="ceramica-swiss__meta">
              <p className="ceramica-swiss__line">Colombia, Cerámica,</p>
              <p className="ceramica-swiss__line ceramica-swiss__line--muted">
                Refugio para la exploración
              </p>
              <p className="ceramica-swiss__line">Raku, Saggar, Obvara</p>
            </div>
            <blockquote className="ceramica-swiss__quote ceramica-swiss__quote--longform">
              <p className="ceramica-swiss__quote-text">
                Lo más hermoso y profundo de la cerámica es dejarse usar como
                medio para que la naturaleza se exprese a sí misma.
              </p>
            </blockquote>
          </div>
          <div className="ceramica-swiss__row" aria-label="Título y vídeo">
            <h1 className="ceramica-swiss__title" id="ceramica-titulo">
              <span className="ceramica-swiss__title-line">Espacio creativo</span>
              <span className="ceramica-swiss__title-line">de exploración,</span>
              <span className="ceramica-swiss__title-line">a través de</span>
              <span className="ceramica-swiss__title-line">la cerámica.</span>
            </h1>
            <div className="ceramica-swiss__video-wrap">
              <video
                className="ceramica-swiss__video"
                autoPlay
                loop
                muted
                playsInline
                aria-label="Vídeo del taller"
              >
                <source src={VIIDEO} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      <section className="home-vitrina" aria-labelledby="vitrina-title">
        <div className="home-vitrina__inner">
          <h2 id="vitrina-title">Piezas en la vitrina</h2>
          <p className="home-vitrina__lede">
            Cinco obras elegidas como puerta de entrada al catálogo. Consulta
            disponibilidad pieza por pieza.
          </p>
          <div className="home-vitrina__grid">
            {vitrina.map((p) => (
              <Link
                key={p.id}
                to={`/piezas/${p.id}`}
                className="home-vitrina__card"
              >
                <div className="home-vitrina__img">
                  <img
                    src={p.imagenes[0]}
                    alt=""
                    width={600}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="home-vitrina__tag">{p.tecnica}</p>
                <h3>{p.titulo}</h3>
                <span className="home-vitrina__cta">Ver ficha</span>
              </Link>
            ))}
          </div>
          <div className="home-vitrina__actions">
            <Link className="btn-pill" to="/piezas">
              Ver exhibición completa
            </Link>
          </div>
        </div>
      </section>

      {bita ? (
        <section className="home-bita" aria-labelledby="bita-title">
          <div className="home-bita__inner">
            <Link to={`/bitacora/${bita.id}`} className="home-bita__card">
              <div className="home-bita__cover">
                <img
                  src={bita.portada}
                  alt=""
                  width={1200}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="home-bita__text">
                <h2 id="bita-title" className="home-bita__section-title">
                  Bitácora
                </h2>
                {bita.fecha ? (
                  <time dateTime={bita.fecha}>{bita.fecha}</time>
                ) : null}
                <h3>{bita.titulo}</h3>
                <p>{bita.extracto}</p>
              </div>
            </Link>
            <div className="home-bita__actions">
              <Link className="btn-pill btn-pill--ghost" to="/bitacora">
                Todas las entradas
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section
        className="section home-talleres-bento section--panel-bg"
        aria-labelledby="talleres-home-title"
      >
        <div className="home-talleres-bento__intro">
          <h2 id="talleres-home-title" className="labor__title">
            Talleres
          </h2>
          <p className="talleres__lede">
            Experiencias presenciales: quemas, introducciones a técnicas y
            encuentros en el estudio.
          </p>
          <Link
            className="btn-pill btn-pill--ghost"
            to="/talleres"
          >
            Ver fechas e inscripción
          </Link>
        </div>
        <div className="bento home-talleres-bento__bento" aria-label="Ejes de trabajo">
          <div className="bento__grid">
            <div className="bento__cell bento__cell--img">
              <img
                className="bento__image"
                src={IMAGES.revelado}
                alt=""
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bento__cell">
              <p className="bento__label">Modelado</p>
            </div>
            <div className="bento__cell bento__cell--img">
              <img
                className="bento__image"
                src={IMAGES.podcast}
                alt=""
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bento__cell">
              <p className="bento__label">Esmalte &amp; prueba</p>
            </div>
            <div className="bento__cell bento__cell--img">
              <img
                className="bento__image"
                src={IMAGES.reveladoCopia}
                alt=""
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="bento__cell">
              <p className="bento__label">Comunidad</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
