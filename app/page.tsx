// CUSTOM: replaced upstream demo page with iLife homepage
import { Suspense } from "react";
import { HeroCarousel } from "@/components/custom/home/hero-carousel";
import { AboutSection } from "@/components/custom/home/about-section";
import { AboutSkeleton } from "@/components/custom/home/about-skeleton";
import { FeaturedProductsSkeleton } from "@/components/custom/home/featured-products-skeleton";
import { MerekProdukSkeleton } from "@/components/custom/home/merek-produk-skeleton";
import { FeaturesSection } from "@/components/custom/home/features-section";
import { FeaturedProductsSection } from "@/components/custom/home/featured-products";
import { ClientsSection } from "@/components/custom/home/clients-section";
import { MerekProdukSection } from "@/components/custom/home/merek-produk-section";
import { TrustStatsSection } from "@/components/custom/home/trust-stats-section";

export default function Home() {

  return (
    <main>
      <HeroCarousel />
      <Suspense fallback={<AboutSkeleton />}>
        <AboutSection />
      </Suspense>
      <TrustStatsSection />
      <ClientsSection />
      <FeaturesSection />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>
      <Suspense fallback={<MerekProdukSkeleton />}>
        <MerekProdukSection />
      </Suspense>
    </main>
  );
}