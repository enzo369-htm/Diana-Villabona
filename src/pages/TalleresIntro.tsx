import { useEffect, useRef } from "react";
import { VIDEO_TALLERES } from "../images";

export function TalleresIntro() {
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

    return () => {
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <section className="talleres-intro" aria-labelledby="talleres-intro-title">
      <video
        ref={videoRef}
        className="talleres-intro__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      >
        <source src={VIDEO_TALLERES} type="video/mp4" />
      </video>
      <div className="talleres-intro__shade" aria-hidden />
      <div className="talleres-intro__caption">
        <h1 id="talleres-intro-title" className="section-title talleres-intro__title">
          Talleres
        </h1>
      </div>
    </section>
  );
}
