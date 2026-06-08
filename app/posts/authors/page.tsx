import { getAllAuthors } from "@/lib/wordpress";
import { ArchiveList } from "@/components/archive-list";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Semua Penulis",
  description: "Jelajahi semua penulis dari postingan artikel kami",
  alternates: { canonical: "/posts/authors" },
};

export default async function Page() {
  const authors = await getAllAuthors();
  return (
    <ArchiveList
      items={authors}
      title="Semua Penulis"
      emptyMessage="Belum ada penulis tersedia."
      getHref={(author) => `/posts/?author=${author.id}`}
    />
  );
}
