import { decodeHtmlEntities } from "@/lib/utils";

const baseUrl = process.env.WORDPRESS_URL;

export interface PortofolioItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  imageAlt: string;
  kategori: string;
  clientName: string;
  projectUrl: string;
  tahun: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPortofolioItem(p: any): PortofolioItem {
  const decodedTitle = decodeHtmlEntities(p.title.rendered);
  return {
    id: p.id,
    slug: p.slug,
    title: decodedTitle,
    excerpt: p.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() ?? "",
    content: p.content?.rendered ?? "",
    imageUrl: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
    imageAlt: decodeHtmlEntities(
      p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || p.title.rendered
    ),
    kategori: p.meta?.kategori ?? "",
    clientName: p.meta?.client_name ?? "",
    projectUrl: p.meta?.project_url ?? "",
    tahun: p.meta?.tahun ?? "",
  };
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
    return posts.map(mapPortofolioItem);
  } catch {
    return [];
  }
}

export async function getPortofolioBySlug(
  slug: string
): Promise<PortofolioItem | null> {
  if (!baseUrl) return null;
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/portofolio?_embed&slug=${encodeURIComponent(slug)}&status=publish`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["portofolio", `portofolio-${slug}`], revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return null;
    return mapPortofolioItem(posts[0]);
  } catch {
    return null;
  }
}

export async function getAllPortofolioSlugs(): Promise<{ slug: string }[]> {
  if (!baseUrl) return [];
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/portofolio?per_page=100&status=publish&_fields=slug`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["portofolio"], revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return posts.map((p: any) => ({ slug: p.slug }));
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
