// CUSTOM: replaced upstream demo page with iLife homepage
import { Suspense } from "react";
import { HeroCarousel } from "@/components/custom/home/hero-carousel";
import { AboutSection } from "@/components/custom/home/about-section";
import { FeaturesSection } from "@/components/custom/home/features-section";
import { FeaturedProductsSection } from "@/components/custom/home/featured-products";
import { ClientsSection } from "@/components/custom/home/clients-section";

export default function Home() {
  // CUSTOM: section order matches original ilife.co.id
  // Hero → About → Client Logos → Features → Featured Products
  return (
    <main>
      <HeroCarousel />
      <AboutSection />
      <ClientsSection />
      <FeaturesSection />
      <Suspense>
        <FeaturedProductsSection />
      </Suspense>
    </main>
  );
}
