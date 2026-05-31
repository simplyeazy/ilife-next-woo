import { getSlides } from "@/lib/custom/slides";
import { HeroCarouselClient } from "./hero-carousel-client";

export async function HeroCarousel() {
  const slides = await getSlides();
  if (!slides.length) return null;
  return <HeroCarouselClient slides={slides} />;
}