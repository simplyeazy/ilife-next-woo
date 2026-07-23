// CUSTOM: replaced upstream demo page with iLife homepage
import { Suspense } from "react";
import { HeroCarousel } from "@/components/custom/home/hero-carousel";
import { AboutSection } from "@/components/custom/home/about-section";
import { FeaturesSection } from "@/components/custom/home/features-section";
import { FeaturedProductsSection } from "@/components/custom/home/featured-products";
import { ClientsSection } from "@/components/custom/home/clients-section";
import { MerekProdukSection } from "@/components/custom/home/merek-produk-section";
import { TrustStatsSection } from "@/components/custom/home/trust-stats-section";

export default function Home() {
  // CUSTOM: section order matches original ilife.co.id
  // Hero → About → Client Logos → Features → Featured Products → Merek Produk
  return (
    <main>
      <HeroCarousel />
      <AboutSection />
      <TrustStatsSection />
      <ClientsSection />
      <FeaturesSection />
      <Suspense>
        <FeaturedProductsSection />
      </Suspense>
      <Suspense>
        <MerekProdukSection />
      </Suspense>
    </main>
  );
}
