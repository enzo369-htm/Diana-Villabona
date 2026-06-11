import { useEffect, useRef } from "react";
import { VIDEO_HOME_DIANA } from "../images";

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
          <blockquote className="ceramica-swiss__poem" id="ceramica-titulo">
            <p className="ceramica-swiss__poem-mark" aria-hidden>
              ◦
            </p>
            <div className="ceramica-swiss__poem-stanza">
              <p className="ceramica-swiss__poem-line">
                Me acerco a la Tierra con curiosidad.
              </p>
              <p className="ceramica-swiss__poem-line">
                Dejo que me enseñe porque se que
              </p>
              <p className="ceramica-swiss__poem-line">
                si guardo silencio aprendo a observar.
              </p>
            </div>
            <div className="ceramica-swiss__poem-stanza">
              <p className="ceramica-swiss__poem-line">
                Me detengo y escarbo,
              </p>
              <p className="ceramica-swiss__poem-line">
                y entre más profundo llego,
              </p>
              <p className="ceramica-swiss__poem-line">
                voy entiendiendo que también soy ella.
              </p>
            </div>
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
            <source src={VIDEO_HOME_DIANA} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
