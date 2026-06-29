// CUSTOM: Sertifikat page — content managed via WordPress page with slug "sertifikat"
import { getPageBySlug } from "@/lib/wordpress";
import { generateContentMetadata } from "@/lib/metadata";
import { Section, Container, Prose } from "@/components/craft";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("sertifikat");
  if (!page) return {};
  return generateContentMetadata({
    title: page.title.rendered,
    excerpt: page.excerpt?.rendered,
    content: page.content.rendered,
    slug: page.slug,
    type: "page",
  });
}

export default async function SertifikatPage() {
  const page = await getPageBySlug("sertifikat");

  if (!page) {
    notFound();
  }

  // breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: "https://ilife.co.id",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tentang Kami",
        item: "https://ilife.co.id/tentang-kami",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Sertifikat",
        item: "https://ilife.co.id/sertifikat",
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
        <Prose>
          <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
        </Prose>
        <div
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </Container>
    </Section>
  );
}
