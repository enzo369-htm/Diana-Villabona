import { HeroDynamicSplit } from "./HeroDynamicSplit";
import { HomePortfolioPreview } from "./HomePortfolioPreview";
import { HomeVitrina } from "./HomeVitrina";

export function HomePage() {
  return (
    <>
      <section className="hero" id="inicio" aria-label="Bienvenida">
        <div className="hero__image-wrap hero__image-wrap--split">
          <HeroDynamicSplit />
        </div>
      </section>
      <HomePortfolioPreview />
      <HomeVitrina />
    </>
  );
}
