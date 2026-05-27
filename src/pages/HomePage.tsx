import { HomeCeramicaIntro } from "./HomeCeramicaIntro";
import { HomeHero, homeHeroWrapClass } from "./HomeHero";
import { HomeVitrina } from "./HomeVitrina";

export function HomePage() {
  return (
    <>
      <section className="hero" id="inicio" aria-label="Bienvenida">
        <div className={homeHeroWrapClass()}>
          <HomeHero />
        </div>
      </section>
      <HomeCeramicaIntro />
      <HomeVitrina />
    </>
  );
}
