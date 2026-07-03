// CUSTOM: Halaman Portofolio — konten dikelola via CPT 'portofolio' di WordPress
import { getPortofolioItems, getPortofolioKategori } from "@/lib/custom/portofolio";
import { PortofolioGallery } from "@/components/custom/portofolio/portofolio-gallery";
import { Section, Container } from "@/components/craft";
import { siteConfig } from "@/site.config";
import { CustomBreadcrumb } from "@/components/custom/breadcrumb";
import type { BreadcrumbItemType } from "@/components/custom/breadcrumb";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Portofolio Pemasangan Videotron, Huruf Timbul, Neonbox dan Signage | " + siteConfig.site_name,
  description: `Galeri proyek dan hasil kerja ${siteConfig.site_name} dalam berbagai proyek videotron, huruf timbul, neonbox, dan signage yang telah kami kerjakan baik untuk pemerintahan, swasta dan sewa (rental).`,
  alternates: {
    canonical: "/portofolio",
  },
};

export default async function PortofolioPage() {
  const items = await getPortofolioItems();
  const kategoriList = getPortofolioKategori(items);
  const featuredItems = items.filter((item) => item.isFeatured).slice(0, 2);
  const galleryItems = items.filter((item) => !item.isFeatured);

  const breadcrumbItems: BreadcrumbItemType[] = [
    { label: "Beranda", href: "/" },
    { label: "Portofolio" },
  ];

  return (
    <Section>
      <Container>
        <CustomBreadcrumb items={breadcrumbItems} />

        {/* FEATURED PROJECTS HERO SECTION */}
        {featuredItems.length > 0 && (
          <div className="mb-16 space-y-12">
            <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">Proyek Unggulan</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {featuredItems.map((item) => (
                <div key={item.id} className="group relative flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                  <Link href={`/portofolio/${item.slug}`} className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority // High priority loading for hero images
                      />
                    )}
                    {item.kategori && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-primary/90 hover:bg-primary">{item.kategori}</Badge>
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {item.clientName && (
                          <span className="text-sm font-medium text-muted-foreground">{item.clientName}</span>
                        )}
                        {item.tahun && (
                          <>
                            <span className="text-muted-foreground/50">•</span>
                            <span className="text-sm text-muted-foreground">{item.tahun}</span>
                          </>
                        )}
                      </div>
                      <Link href={`/portofolio/${item.slug}`}>
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      {item.excerpt && (
                        <p className="mt-2 text-muted-foreground line-clamp-2">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="mt-6">
                      <Button variant="outline" asChild className="group/btn">
                        <Link href={`/portofolio/${item.slug}`}>
                          Lihat Studi Kasus
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STANDARD GALLERY GRID */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Proyek iLife Advertising lainnya</h2>
          {/* We pass galleryItems so we don't duplicate the featured ones in the grid */}
          <PortofolioGallery items={galleryItems} kategoriList={kategoriList} />
        </div>
      </Container>
    </Section>
  );
}
