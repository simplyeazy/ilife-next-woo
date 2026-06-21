// CUSTOM: Halaman detail portofolio — slug dari CPT 'portofolio' di WordPress
import {
  getPortofolioBySlug,
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

  return {
    title: item.title,
    description: item.excerpt || `Proyek portofolio ${item.title}`,
    alternates: { canonical: `/portofolio/${slug}` },
    openGraph: {
      title: item.title,
      description: item.excerpt || `Proyek portofolio ${item.title}`,
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

  return (
    <Section>
      <Container>
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
      </Container>
    </Section>
  );
}
