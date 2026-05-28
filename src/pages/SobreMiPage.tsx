import { IMAGES } from "../images";

export function SobreMiPage() {
  return (
    <div className="page-content page-content--pad sobre-mi">
      <header className="page-header">
        <h1>Acerca</h1>
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
          <p>texto</p>
        </div>
      </div>
    </div>
  );
}
