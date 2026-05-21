import { HeroDynamicSplit } from "./HeroDynamicSplit";
import { HomePortfolioPreview } from "./HomePortfolioPreview";

export function HomePage() {
  return (
    <>
      <section className="hero" id="inicio" aria-label="Bienvenida">
        <div className="hero__image-wrap hero__image-wrap--split">
          <HeroDynamicSplit />
        </div>
      </section>
      <HomePortfolioPreview />
    </>
  );
}
