import { CONTACT_EMAIL } from "../siteConfig";
import { useContent } from "../context/ContentContext";
import { IMAGES } from "../images";
import { plainTextToSafeHtml } from "../utils/plainText";

export function SobreMiPage() {
  const { acerca } = useContent();
  const imagen = acerca.imagen.trim() || IMAGES.quienSoy;

  return (
    <div className="page-content page-content--pad sobre-mi">
      <header className="page-header">
        <h1>Acerca</h1>
      </header>

      <div className="sobre-mi__split">
        <div className="sobre-mi__img">
          <img
            src={imagen}
            alt=""
            width={900}
            height={1100}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="sobre-mi__text">
          <div
            dangerouslySetInnerHTML={{
              __html: plainTextToSafeHtml(acerca.texto),
            }}
          />
          <div className="sobre-mi__cta">
            <a
              className="btn-pill btn-pill--accent"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              ¿Hablamos?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
