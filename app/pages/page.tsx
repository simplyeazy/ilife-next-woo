import { getAllPages } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Semua Halaman",
  description: "Jelajahi semua halaman dari postingan artikel kami",
  alternates: {
    canonical: "/posts/pages",
  },
};

export default async function Page() {
  const pages = await getAllPages();

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>Semua Halaman</h2>
          {pages.length > 0 ? (
            <ul className="grid">
              {pages.map((page: any) => (
                <li key={page.id}>
                  <Link href={`/pages/${page.slug}`}>{page.title.rendered}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Belum ada halaman tersedia.</p>
          )}
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
