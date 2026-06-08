import { getAllCategories } from "@/lib/wordpress";
import { ArchiveList } from "@/components/archive-list";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Semua Kategori",
  description: "Jelajahi semua kategori dari postingan artikel kami",
  alternates: { canonical: "/posts/categories" },
};

export default async function Page() {
  const categories = await getAllCategories();
  return (
    <ArchiveList
      items={categories}
      title="Semua Kategori"
      emptyMessage="Belum ada kategori tersedia."
      getHref={(category) => `/posts/?category=${category.id}`}
    />
  );
}
