import { getAllTags } from "@/lib/wordpress";
import { ArchiveList } from "@/components/archive-list";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Semua label",
  description: "Jelajahi semua label dari postingan artikel kami",
  alternates: { canonical: "/posts/tags" },
};

export default async function Page() {
  const tags = await getAllTags();
  return (
    <ArchiveList
      items={tags}
      title="Semua label"
      emptyMessage="Belum ada label tersedia."
      getHref={(tag) => `/posts/?tag=${tag.id}`}
    />
  );
}
