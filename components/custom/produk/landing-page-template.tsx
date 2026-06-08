// CUSTOM: Server component for layanan (CMS-managed SEO landing pages) under /produk/[slug]
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Section, Container, Prose } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/site.config";
import { getPortofolioItems } from "@/lib/custom/portofolio";
import type { LayananItem } from "@/lib/custom/layanan";

interface LandingPageTemplateProps {
  item: LayananItem;
}

export async function LandingPageTemplate({ item }: LandingPageTemplateProps) {
  const waNumber = siteConfig.whatsapp_number.replace(/\D/g, "");
  const waMessage = item.waMessage ||
    `Halo iLife, saya ingin konsultasi mengenai layanan: ${item.title}. Mohon informasi lebih lanjut.`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  // Fetch portfolio items filtered by this service's kategori
  const allPortofolio = item.portofolioKategori
    ? await getPortofolioItems()
    : [];
  const relatedPortofolio = allPortofolio.filter(
    (p) =>
      p.kategori.toLowerCase() === item.portofolioKategori.toLowerCase()
  );

  return (
    <Section>
      <Container>
        <div className="space-y-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/produk" className="hover:text-foreground">
              Produk
            </Link>
            <span>/</span>
            <span className="text-foreground">{item.title}</span>
          </nav>

          {/* Hero */}
          <div className="space-y-6">
            {item.imageUrl && (
              <div className="relative w-full aspect-[16/6] rounded-xl overflow-hidden bg-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {item.title}
            </h1>
          </div>

          {/* Main content (Gutenberg HTML) */}
          {item.content && (
            <Prose>
              <div
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </Prose>
          )}

          {/* CTA */}
          <div className="rounded-2xl bg-muted/50 border p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xl font-semibold">Tertarik dengan layanan ini?</p>
              <p className="text-muted-foreground text-sm">
                Konsultasi gratis, respon cepat. Dapatkan penawaran harga terbaik.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Konsultasi via WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  Minta Penawaran Harga
                </a>
              </Button>
            </div>
          </div>

          {/* Related portfolio */}
          {relatedPortofolio.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Proyek yang Telah Kami Kerjakan</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {relatedPortofolio.map((porto) => (
                  <Link
                    key={porto.id}
                    href={`/portofolio/${porto.slug}`}
                    className="group block rounded-xl overflow-hidden border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      {porto.imageUrl ? (
                        <Image
                          src={porto.imageUrl}
                          alt={porto.imageAlt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
                          Tidak ada gambar
                        </div>
                      )}
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">
                        {porto.title}
                      </p>
                      {porto.clientName && (
                        <p className="text-xs text-muted-foreground">{porto.clientName}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
