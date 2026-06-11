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
          <p>
            La cerámica es el lugar donde conviven muchas de las cosas que me
            interesan: la tierra, el hacer con las manos, la investigación, el
            fuego, la naturaleza y el aprendizaje compartido. Mi práctica se
            desarrolla a través de la construcción manual y las quemas
            experimentales, y ha sido profundamente enriquecida por los
            encuentros, los viajes y las personas que generosamente han
            compartido sus conocimientos conmigo a lo largo del camino.
          </p>
          <p>
            Mi búsqueda se ha centrado en la exploración de la forma, la
            investigación de superficies y las atmósferas de quema, acercándome a
            procesos donde el control convive con la incertidumbre. Con el tiempo
            he encontrado en la cerámica una práctica que me invita a ofrecer mi
            presencia, a observar con más atención, a aceptar la incertidumbre y a
            aprender de los procesos, dentro y fuera del taller.
          </p>
          <p>
            Me atraen especialmente las huellas que deja el fuego y la manera en
            que cada quema transforma la materia de formas inesperadas. Me
            interesan los procesos donde existe espacio para la sorpresa y donde
            las piezas conservan rastros de las decisiones, los materiales y las
            circunstancias que las hicieron posibles. Mi trabajo se mueve entre lo
            utilitario y lo escultórico, donde cada pieza recoge algo de su propio
            recorrido.
          </p>
          <p>
            Además de mi práctica de taller, desarrollo espacios de formación
            enfocados en la experimentación. Entiendo la enseñanza como una
            oportunidad para compartir conocimientos, intercambiar experiencias y
            seguir aprendiendo junto a otras personas.
          </p>
        </div>
      </div>
    </div>
  );
}
