import { HOME_HERO_MODE } from "../homeHeroConfig";
import { HeroDynamicSplit } from "./HeroDynamicSplit";
import { HeroHorizontalCarousel } from "./HeroHorizontalCarousel";
import { HeroStatic } from "./HeroStatic";

export function HomeHero() {
  switch (HOME_HERO_MODE) {
    case "split":
      return <HeroDynamicSplit />;
    case "static":
      return <HeroStatic />;
    case "horizontal-carousel":
      return <HeroHorizontalCarousel />;
    default:
      return <HeroHorizontalCarousel />;
  }
}

export function homeHeroWrapClass(): string {
  switch (HOME_HERO_MODE) {
    case "split":
      return "hero__image-wrap hero__image-wrap--split";
    case "static":
      return "hero__image-wrap hero__image-wrap--static";
    case "horizontal-carousel":
      return "hero__image-wrap hero__image-wrap--carousel";
    default:
      return "hero__image-wrap hero__image-wrap--carousel";
  }
}
