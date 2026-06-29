// CUSTOM: Halaman detail portofolio — slug dari CPT 'portofolio' di WordPress
import {
  getPortofolioBySlug,
  getPortofolioItems,
  getAllPortofolioSlugs,
} from "@/lib/custom/portofolio";
import { Section, Container, Prose } from "@/components/craft";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/site.config";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";
import type { PortofolioItem } from "@/lib/custom/portofolio";

export const revalidate = 3600;

export async function generateStaticParams() {
  return await getAllPortofolioSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortofolioBySlug(slug);
  if (!item) return {};

  // Truncate excerpt to ~155 characters for SEO meta description
  const rawDesc = item.excerpt || `Lihat proyek ${item.title} oleh ${siteConfig.site_name} – ${item.kategori || "portofolio"} terbaru kami.`;
  const metaDescription = rawDesc.length > 155
    ? rawDesc.slice(0, 152) + "..."
    : rawDesc;

  return {
    title: `${item.title} | ${siteConfig.site_name}`,
    description: metaDescription,
    alternates: { canonical: `/portofolio/${slug}` },
    openGraph: {
      title: `${item.title} | ${siteConfig.site_name}`,
      description: metaDescription,
      type: "article",
      url: `${siteConfig.site_domain}/portofolio/${slug}`,
      ...(item.imageUrl && {
        images: [{ url: item.imageUrl, alt: item.imageAlt }],
      }),
    },
  };
}

export default async function PortofolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPortofolioBySlug(slug);

  if (!item) notFound();

  // Fetch related projects (same kategori, excluding current)
  const allItems = await getPortofolioItems();
  const relatedItems: PortofolioItem[] = item.kategori
    ? allItems.filter(
        (i) => i.kategori === item.kategori && i.slug !== slug
      ).slice(0, 3)
    : [];

  // breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: siteConfig.site_domain,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portofolio",
        item: `${siteConfig.site_domain}/portofolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.title,
        item: `${siteConfig.site_domain}/portofolio/${slug}`,
      },
    ],
  };

  return (
    <Section>
      <Container>
        {/* Breadcrumb JSON‑LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        {/* Back link */}
        <Link
          href="/portofolio"
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1"
        >
          ← Kembali ke Portofolio
        </Link>

        {/* Header */}
        <div className="mt-4 mb-6">
          {item.kategori && (
            <Badge variant="secondary" className="mb-3">
              {item.kategori}
            </Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {item.title}
          </h1>
          {(item.clientName || item.tahun) && (
            <p className="mt-2 text-muted-foreground">
              {[item.clientName, item.tahun].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* Featured image */}
        {item.imageUrl && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={item.imageUrl}
              alt={item.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
        )}

        <Separator className="mb-8" />

        {/* Content — admin writes in WP block editor, images/gallery blocks rendered here */}
        {item.content ? (
          <Prose
            className="wp-content"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        ) : item.excerpt ? (
          <p className="text-muted-foreground">{item.excerpt}</p>
        ) : null}

        {/* External project URL */}
        {item.projectUrl && (
          <div className="mt-8">
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 hover:opacity-70"
            >
              Lihat referensi proyek →
            </a>
          </div>
        )}

        {/* Related projects */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-8" />
            <h2 className="text-2xl font-semibold tracking-tight mb-6">
              Proyek Terkait
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((related) => (
                <Link
                  key={related.slug}
                  href={`/portofolio/${related.slug}`}
                  className="group relative flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm transition-all hover:shadow-md"
                >
                  {related.imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={related.imageUrl}
                        alt={related.imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                    {related.clientName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {related.clientName}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
