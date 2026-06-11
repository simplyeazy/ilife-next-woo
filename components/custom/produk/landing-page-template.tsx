// CUSTOM: Server component for layanan (CMS-managed SEO landing pages) under /produk-dan-layanan/[slug]
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Section, Container, Prose } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/site.config";
import type { LayananItem } from "@/lib/custom/layanan";

interface LandingPageTemplateProps {
  item: LayananItem;
}

export async function LandingPageTemplate({ item }: LandingPageTemplateProps) {
  const waNumber = siteConfig.whatsapp_number.replace(/\D/g, "");
  const waMessage = item.waMessage ||
    `Halo iLife, saya ingin konsultasi mengenai layanan: ${item.title}. Mohon informasi lebih lanjut.`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <Section>
      <Container>
        <div className="space-y-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/produk-dan-layanan" className="hover:text-foreground">
              Produk dan Layanan
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

          {/* Product catalog link */}
          {item.wcCategory && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Lihat Katalog Produk</h2>
              <p className="text-muted-foreground">
                Temukan pilihan produk {item.title} kami dengan spesifikasi lengkap dan harga terjangkau.
              </p>
              <Button asChild variant="outline" size="lg">
                <Link href={`/produk-dan-layanan?category=${item.wcCategory}`}>
                  Lihat Semua Produk dan Layanan →
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
