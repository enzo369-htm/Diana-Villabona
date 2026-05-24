import { PortfolioMosaic } from "./PortfolioMosaic";

export function PortfolioPage() {
  return (
    <section className="hero portfolio-page" id="portfolio" aria-label="Portfolio">
      <div className="hero__image-wrap">
        <PortfolioMosaic />
      </div>
    </section>
  );
}
