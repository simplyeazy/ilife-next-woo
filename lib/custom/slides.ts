import { decodeHtmlEntities } from "@/lib/utils";

const baseUrl = process.env.WORDPRESS_URL;

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  videoUrl: string | null;
  posterUrl: string | null;
  ctaText: string;
  ctaUrl: string;
}

export async function getSlides(): Promise<SlideData[]> {
  if (!baseUrl) return [];
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/slides?_embed&per_page=20&orderby=menu_order&order=asc`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["slides"], revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((p: any) => ({
      id: p.id,
      title: decodeHtmlEntities(p.title.rendered),
      subtitle: p.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() ?? "",
      imageUrl: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
      videoUrl: p.video_url ?? null,      // from our REST field
      posterUrl: p.poster_url ?? null,    // from our REST field
      ctaText: p.meta?.cta_text || "Lihat Produk",
      ctaUrl: p.meta?.cta_url || "/shop",
    }));
  } catch {
    return [];
  }
}