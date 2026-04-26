import { useState } from "react";
import { GALLERY_POOL, IMAGES, pickRandomUnique, VIIDEO } from "./images";
import "./App.css";

function HeroImg({ src, priority, className }: { src: string; priority?: boolean; className?: string }) {
  // Todo el mosaico va en "above the fold": lazy + flex + min-height:0 deja
  // celdas a 0px hasta el decode; eager + relleno absoluto evita huecos/parpadeos.
  // Un solo .hero__cell por celda: si se anida otro, el interior colapsa a 0 (img absoluta).
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

/**
 * Mosaico de 5 fotos: grid 2×2 + columna derecha a todo alto.
 * Origen: jpg con “hero” en el nombre en /public.
 * hero↔hero5 intercambiados; ex hero3→hero6, ex hero4→hero7; hero2 igual.
 */
function HeroMosaic() {
  return (
    <div className="hero__mosaic hero__mosaic--grid-5" role="presentation" aria-hidden>
      <HeroImg src={IMAGES.hero5} priority />
      <HeroImg src={IMAGES.hero2} />
      <HeroImg src={IMAGES.hero6} />
      <HeroImg src={IMAGES.hero7} />
      <HeroImg src={IMAGES.hero} />
    </div>
  );
}

const showcaseItems = [
  {
    img: IMAGES.revelado,
    tag: "Proceso",
    title: "Cuidado y presencia en el taller",
    note: "Revelado y pausa consciente",
  },
  {
    img: IMAGES.fuegos,
    tag: "Horno",
    title: "Primeras quemas y gratitud al fuego",
    note: "Energía compartida en el estudio",
  },
  {
    img: IMAGES.barro,
    tag: "Materia",
    title: "Barro, memoria y territorio",
    note: "Color que cuenta historias",
  },
  {
    img: IMAGES.reveladoCopia,
    tag: "Tuate",
    title: "Imagen, tiempo y cuerpo",
    note: "De la cámara al barro",
  },
  {
    img: IMAGES.podcast,
    tag: "Escucha",
    title: "Conversación y manos al mismo tiempo",
    note: "El taller como radio íntima",
  },
  {
    img: IMAGES.podcastCopia,
    tag: "Ecos",
    title: "Repetir para afilar la mirada",
    note: "Segunda toma, mismo cuidado",
  },
] as const;

/** Enlace al perfil de Instagram (añade el @ en la ruta si ya existe cuenta pública) */
const INSTAGRAM_URL = "https://www.instagram.com/";

function LaborImageRow() {
  const [srcs] = useState(() => pickRandomUnique(GALLERY_POOL, 3));
  return (
    <div className="split__stack-row">
      {srcs.map((src) => (
        <div className="split__img split__img--triplet" key={src}>
          <img
            src={src}
            alt=""
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <div className="desktop-gate" role="alert" aria-live="polite">
        <div className="desktop-gate__card">
          <p className="desktop-gate__title">Vista solo para escritorio</p>
          <p className="desktop-gate__text">
            Esta web está pensada para pantallas anchas (a partir de portátiles de unos
            13&quot;). Ábrela en un ordenador o amplía la ventana del navegador para verla
            correctamente; aún no hay versión móvil.
          </p>
        </div>
      </div>

      <div className="app__desktop-only">
      <header className="site-top">
        <div className="site-top__ig">
          <a
            className="site-top__ig-link"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram: Diana Villabona"
            title="Abrir Instagram"
          >
            <span className="site-top__ig-text">Diana Villabona</span>
          </a>
        </div>
        <nav className="site-nav" aria-label="Principal">
          <a href="#inicio">Inicio</a>
          <a href="#muestra">Muestra</a>
          <a href="#labor">Labor</a>
          <a href="#talleres">Talleres</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <section className="hero" id="inicio" aria-label="Bienvenida">
        <div className="hero__image-wrap" aria-hidden>
          <HeroMosaic />
        </div>
      </section>

      <section className="ceramica-swiss" id="ceramica" aria-label="Presentación">
        <div className="ceramica-swiss__inner">
          <div className="ceramica-swiss__head">
            <p className="ceramica-swiss__name">Diana Villabona</p>
            <div className="ceramica-swiss__meta">
              <p className="ceramica-swiss__line">Colombia, Cerámica,</p>
              <p className="ceramica-swiss__line ceramica-swiss__line--muted">
                Clases y Quemas experimentales
              </p>
              <p className="ceramica-swiss__line">Raku, Saggar, Obvara</p>
            </div>
            <blockquote className="ceramica-swiss__quote ceramica-swiss__quote--longform">
              <p className="ceramica-swiss__quote-text">
                Lo más hermoso y profundo de la cerámica es dejarse usar como medio
                para que la naturaleza se exprese a sí misma.
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
                aria-label="Vídeo del espacio de cerámica"
              >
                <source src={VIIDEO} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section labor"
        id="labor"
        aria-labelledby="labor-title"
      >
        <h2 id="labor-title" className="labor__title">
          Labor
        </h2>
        <div className="split split--stack labor__inner">
          <LaborImageRow />
          <div className="split__text">
            <span className="split__kicker">Aquí: etiqueta</span>
            <h2>Aquí: título</h2>
            <p>Aquí va el texto.</p>
          </div>
        </div>
      </section>

      <section
        className="section talleres"
        id="talleres"
        aria-labelledby="talleres-title"
      >
        <h2 id="talleres-title" className="labor__title">
          Talleres
        </h2>
        <p className="talleres__lede">
          Clases, quemas experimentales y encuentros en el estudio. Aquí puedes
          añadir fechas, modalidades o cómo inscribirse.
        </p>
      </section>

      <div className="section split split--stack split--reverse">
        <div className="split__img">
          <img
            src={IMAGES.barro}
            alt="Barro y materiales en un contexto con sentido de lugar"
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="split__text">
          <span className="split__kicker">Aquí: etiqueta</span>
          <h2>Aquí: título</h2>
          <p>Aquí va el texto.</p>
        </div>
      </div>

      <div className="section split split--stack">
        <div className="split__img">
          <img
            src={IMAGES.quienSoy}
            alt="Quien participa o guía en el espacio creativo"
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="split__text">
          <span className="split__kicker">Aquí: etiqueta</span>
          <h2>Aquí: título</h2>
          <p>Aquí va el texto.</p>
        </div>
      </div>

      <section
        className="showcase"
        id="muestra"
        aria-labelledby="muestra-title"
      >
        <h2 id="muestra-title">La muestra</h2>
        <div className="showcase__stacks" role="list">
          {showcaseItems.map((item) => (
            <div
              className="split split--stack showcase-stack"
              key={item.title}
              role="listitem"
            >
              <div className="split__img">
                <img
                  src={item.img}
                  alt=""
                  width={600}
                  height={600}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="split__text">
                <span className="split__kicker">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="showcase__contact" id="contacto">
          <p>Hacemos encuentros, residencias breves y talleres por nodo</p>
        </div>
      </section>

      <div className="bento" aria-label="Ejes de trabajo">
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

      <footer className="footer">
        <h2>Join us</h2>
        <form
          className="newsletter"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input type="email" name="email" placeholder="Email" autoComplete="email" />
          <button className="btn-pill btn-pill--dark" type="submit">
            Enviar
          </button>
        </form>
        <div className="footer-links">
          <a href="#inicio">Inicio</a>
          <a href="#muestra">Muestra</a>
          <a href="#talleres">Talleres</a>
          <a href="#contacto">Contacto</a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            Instagram
          </a>
        </div>
        <p className="credit">
          Muestra — espacio creativo. Inspiración de maquetación: sitios editoriales
          artesanales. Imágenes del proyecto en la carpeta public.
        </p>
      </footer>

      <aside
        className="proposal-poster"
        aria-label="Propuesta de desarrollo web"
      >
        <div className="proposal-poster__inner">
          <p className="proposal-poster__kicker" aria-hidden>
            WEB
            <br />
            MUESTRA
          </p>
          <div className="proposal-poster__body">
            <section className="proposal-poster__block">
              <h2 className="proposal-poster__h">Naturaleza del proyecto</h2>
              <p className="proposal-poster__p">
                Esta es una maqueta de web: el diseño es 100% original, así como el
                armado; no hay plantillas ni cosas prefabricadas, aunque sí hay bases
                de diseño tomadas de otros diseñadores. De esta web se toma lo que tú
                decidas: en ella hay varias posibilidades de diseño, y también es en sí
                misma una web funcionando.
              </p>
              <p className="proposal-poster__p">
                Mi propuesta es crear un espacio digital propio que funcione como una
                extensión de tu universo. Este sitio web es un espacio de sentido dedicado
                a la exploración profunda de la cerámica. No busca solo mostrar piezas, sino
                invitar al usuario a detenerse, conectar con el material y la naturaleza en
                cada proceso.
              </p>
              <p className="proposal-poster__p">
                Un lugar donde tu arte no solo se vea, sino que se habite, eliminando las
                distracciones de las redes sociales para que el usuario pueda sumergirse
                realmente en tu universo de sentido y generar más interés en habitar los
                mundos que enseña la cerámica.
              </p>
            </section>

            <section className="proposal-poster__block">
              <h2 className="proposal-poster__h">Potencial de transformación</h2>
              <p className="proposal-poster__p">
                No estamos limitados por esta estructura: la web está hecha completamente
                desde cero con código. Podemos:
              </p>
              <ul className="proposal-poster__ul">
                <li>
                  Rediseñar secciones completas según las prioridades de Muestra y de cómo
                  quieres contar tu taller, tus piezas y tu proceso.
                </li>
                <li>
                  Ajustar el tono visual para que refleje la calidez, la textura y la
                  sofisticación de tu oficio, lejos de la estética genérica de las redes.
                </li>
                <li>
                  Co-crear la experiencia de usuario: mi labor es traducir tu criterio
                  artístico y pedagógico en código limpio, claro y funcional.
                </li>
              </ul>
            </section>

            <section className="proposal-poster__block">
              <h2 className="proposal-poster__h">Compromiso de entrega y soporte</h2>
              <p className="proposal-poster__p">
                Para garantizar que lleguemos exactamente a donde tú quieras llegar con
                Muestra, la propuesta incluye:
              </p>
              <ul className="proposal-poster__ul">
                <li>
                  <strong>Soporte técnico de adaptación:</strong> 3 meses de ajustes de
                  código para pulir detalles y perfeccionar el sitio.
                </li>
                <li>
                  <strong>Capacitación de gestión:</strong> entrega de herramientas para
                  que puedas actualizar piezas de video e imágenes de manera autónoma.
                </li>
              </ul>
            </section>

            <section className="proposal-poster__block">
              <h2 className="proposal-poster__h">Inversión sugerida</h2>
              <p className="proposal-poster__p">
                El presupuesto para la implementación, personalización total y
                acompañamiento técnico se sitúa en un rango de <strong>130 a 170 USD</strong>{" "}
                (negociable según la complejidad de las nuevas funciones que decidamos
                integrar).
              </p>
            </section>
          </div>
        </div>
        <a
          className="proposal-poster__btn"
          href="https://portfolio-web-11.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio — Enzo Federico
        </a>
      </aside>
      </div>
    </div>
  );
}

export default App;
