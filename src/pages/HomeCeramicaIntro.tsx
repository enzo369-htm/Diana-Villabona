import { useEffect, useRef } from "react";
import { VIIDEO } from "../images";

export function HomeCeramicaIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const tryPlay = () => {
      void video.play().catch(() => {
        /* autoplay bloqueado hasta interacción */
      });
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    return () => video.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <section className="ceramica-swiss" id="ceramica" aria-labelledby="ceramica-titulo">
      <div className="ceramica-swiss__split">
        <div className="ceramica-swiss__text">
          <blockquote
            className="ceramica-swiss__quote ceramica-swiss__quote--longform ceramica-swiss__quote--feature"
            id="ceramica-titulo"
          >
            <p className="ceramica-swiss__quote-text">
              Me acerco a la Tierra con curiosidad. Dejo que me enseñe porque se que si guardo silencio aprendo a observar.
            </p>
            <p className="ceramica-swiss__quote-text">
              Me detengo y escarbo, y entre más profundo llego, voy entiendiendo que también soy ella.
            </p>
          </blockquote>
        </div>
        <div className="ceramica-swiss__video-wrap">
          <video
            ref={videoRef}
            className="ceramica-swiss__video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Vídeo del taller"
          >
            <source src={VIIDEO} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
