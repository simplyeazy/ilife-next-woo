// CUSTOM: Profil Perusahaan page — content managed via WordPress page with slug "tentang-kami"
import { getPageBySlug } from "@/lib/wordpress";
import { generateContentMetadata } from "@/lib/metadata";
import { Section, Container, Prose } from "@/components/craft";
import { CustomBreadcrumb } from "@/components/custom/breadcrumb";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("tentang-kami");
  if (!page) return {};
  return generateContentMetadata({
    title: page.title.rendered,
    excerpt: page.excerpt?.rendered,
    content: page.content.rendered,
    slug: page.slug,
    type: "page",
  });
}

export default async function TentangKamiPage() {
  const page = await getPageBySlug("tentang-kami");

  if (!page) {
    notFound();
  }

  return (
    <Section>
      <Container>
        <CustomBreadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Tentang Kami" },
          ]}
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

