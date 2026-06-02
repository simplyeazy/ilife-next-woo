// CUSTOM: Halaman Portofolio — konten dikelola via CPT 'portofolio' di WordPress
import { getPortofolioItems, getPortofolioKategori } from "@/lib/custom/portofolio";
import { PortofolioGallery } from "@/components/custom/portofolio/portofolio-gallery";
import { Section, Container } from "@/components/craft";
import { siteConfig } from "@/site.config";

import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Portofolio",
  description: `Galeri proyek dan instalasi ${siteConfig.site_name}. Lihat berbagai proyek LED display, signage, dan videotron yang telah kami kerjakan.`,
  alternates: {
    canonical: "/portofolio",
  },
};

export default async function PortofolioPage() {
  const items = await getPortofolioItems();
  const kategoriList = getPortofolioKategori(items);

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Portofolio
          </h1>
          <p className="mt-2 text-muted-foreground">
            Proyek dan instalasi yang telah kami kerjakan
          </p>
        </div>

        <PortofolioGallery items={items} kategoriList={kategoriList} />
      </Container>
    </Section>
  );
}
