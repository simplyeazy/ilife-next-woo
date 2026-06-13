import { decodeHtmlEntities } from "@/lib/utils";

const baseUrl = process.env.WORDPRESS_URL;

export interface ProdukItem {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  imageAlt: string;
  badgeLabel: string;
  priceLabel: string;
  wcProductSlug: string;
  whatsappMessage: string;
}

export async function getProdukItems(): Promise<ProdukItem[]> {
  if (!baseUrl) return [];
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/produk?_embed&per_page=100&orderby=menu_order&order=asc&status=publish`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["produk"], revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return posts.map((p: any) => {
      const decodedTitle = decodeHtmlEntities(p.title.rendered);
      return {
        id: p.id,
        title: decodedTitle,
        excerpt: p.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() ?? "",
        imageUrl: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
        imageAlt: decodeHtmlEntities(
          p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || p.title.rendered
        ),
        badgeLabel: p.meta?.badge_label ?? "",
        priceLabel: p.meta?.price_label ?? "",
        wcProductSlug: p.meta?.wc_product_slug ?? "",
        whatsappMessage: p.meta?.whatsapp_message ?? "",
      };
    });
  } catch {
    return [];
  }
}

