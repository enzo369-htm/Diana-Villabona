import { IMAGES } from "../images";

/** Hero estático: una foto horizontal a pantalla completa, sin animación. */
export function HeroStatic() {
  return (
    <div className="hero__static" role="presentation" aria-hidden>
      <img
        className="hero__static-img"
        src={IMAGES.hero6}
        alt=""
        width={1080}
        height={720}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}
