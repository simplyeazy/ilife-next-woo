const baseUrl = process.env.WORDPRESS_URL;

export interface LayananItem {
  id: number;
  slug: string;
  title: string;
  content: string; // full Gutenberg-rendered HTML
  excerpt: string; // used as meta description
  imageUrl: string | null;
  imageAlt: string;
  portofolioKategori: string; // matches PortofolioItem.kategori
  waMessage: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLayananItem(p: any): LayananItem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title.rendered,
    content: p.content?.rendered ?? "",
    excerpt: p.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() ?? "",
    imageUrl: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
    imageAlt:
      p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || p.title.rendered,
    portofolioKategori: p.meta?.portofolio_kategori ?? "",
    waMessage: p.meta?.wa_message ?? "",
  };
}

export async function getLayananBySlug(
  slug: string
): Promise<LayananItem | null> {
  if (!baseUrl) return null;
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/layanan?_embed&slug=${encodeURIComponent(slug)}&status=publish`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["layanan", `layanan-${slug}`], revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return null;
    return mapLayananItem(posts[0]);
  } catch {
    return null;
  }
}

export async function getAllLayananSlugs(): Promise<{ slug: string }[]> {
  if (!baseUrl) return [];
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/layanan?per_page=100&status=publish&_fields=slug`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["layanan"], revalidate: 3600 },
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

export async function getAllLayananItems(): Promise<LayananItem[]> {
  if (!baseUrl) return [];
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/layanan?_embed&per_page=100&status=publish`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["layanan"], revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map(mapLayananItem);
  } catch {
    return [];
  }
}
