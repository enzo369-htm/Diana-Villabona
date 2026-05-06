import { IMAGES } from "../images";

export function SobreMiPage() {
  return (
    <div className="page-content page-content--pad sobre-mi">
      <header className="page-header">
        <h1>Sobre mí</h1>
        <p className="page-header__lede">
          Trayectoria, filosofía y visión artística: el contexto detrás del
          taller y de cada pieza.
        </p>
      </header>

      <div className="sobre-mi__split">
        <div className="sobre-mi__img">
          <img
            src={IMAGES.quienSoy}
            alt=""
            width={900}
            height={1100}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="sobre-mi__text">
          <h2>Trayectoria</h2>
          <p>texto</p>
          <h2>Filosofía</h2>
          <p>texto</p>
          <h2>Visión</h2>
          <p>texto</p>
        </div>
      </div>
    </div>
  );
}
