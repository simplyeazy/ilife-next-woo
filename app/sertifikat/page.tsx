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

  return (
    <Section>
      <Container>
        <Prose>
          <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
          <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </Prose>
      </Container>
    </Section>
  );
}
