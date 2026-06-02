const baseUrl = process.env.WORDPRESS_URL;

export interface PortofolioItem {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  imageAlt: string;
  kategori: string;
  clientName: string;
  projectUrl: string;
  tahun: string;
}

export async function getPortofolioItems(): Promise<PortofolioItem[]> {
  if (!baseUrl) return [];
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/portofolio?_embed&per_page=100&orderby=menu_order&order=asc&status=publish`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["portofolio"], revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return posts.map((p: any) => ({
      id: p.id,
      title: p.title.rendered,
      excerpt: p.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() ?? "",
      imageUrl: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
      imageAlt:
        p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || p.title.rendered,
      kategori: p.meta?.kategori ?? "",
      clientName: p.meta?.client_name ?? "",
      projectUrl: p.meta?.project_url ?? "",
      tahun: p.meta?.tahun ?? "",
    }));
  } catch {
    return [];
  }
}

export function getPortofolioKategori(items: PortofolioItem[]): string[] {
  const categories = new Set<string>();
  items.forEach((item) => {
    if (item.kategori) categories.add(item.kategori);
  });
  return Array.from(categories).sort();
}
