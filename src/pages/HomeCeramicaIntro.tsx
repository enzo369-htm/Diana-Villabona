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
      <div className="ceramica-swiss__inner">
        <div className="ceramica-swiss__row" aria-label="Título y vídeo">
          <h1 className="ceramica-swiss__title" id="ceramica-titulo">
            <span className="ceramica-swiss__title-line">Espacio creativo</span>
            <span className="ceramica-swiss__title-line">de exploración,</span>
            <span className="ceramica-swiss__title-line">a través de</span>
            <span className="ceramica-swiss__title-line">la cerámica.</span>
          </h1>
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
      </div>
    </section>
  );
}
