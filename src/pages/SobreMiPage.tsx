import { Link } from "react-router-dom";
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
          <p>
            Mi práctica atraviesa la enseñanza, la experimentación con quemas y
            el trabajo con arcillas que dialogan con el territorio. El taller es
            a la vez estudio y refugio: un lugar donde el ritmo lo marcan el
            barro y el horno.
          </p>
          <h2>Filosofía</h2>
          <p>
            Creo en una cerámica que no compite por la atención, sino que pide
            tiempo. Esta web es una invitación a ese mismo gesto: detenerse,
            mirar de cerca las texturas y entender el proceso como parte del
            encuentro con la obra.
          </p>
          <h2>Visión</h2>
          <p>
            Seguir explorando técnicas ancestrales y contemporáneas —Raku,
            Saggar, Obvara y formulaciones propias de esmalte— siempre con una
            conversación honesta con quienes habitan estas piezas en sus
            espacios.
          </p>
          <p>
            <Link className="text-link" to="/bitacora">
              Bitácora de proceso →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
