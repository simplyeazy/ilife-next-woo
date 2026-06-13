import { decodeHtmlEntities } from "@/lib/utils";

const baseUrl = process.env.WORDPRESS_URL;
const consumerKey = process.env.WC_CONSUMER_KEY;
const consumerSecret = process.env.WC_CONSUMER_SECRET;

export interface MerekItem {
  id: number;
  name: string;
  logoUrl: string | null;
  brandUrl: string | null;    // manufacturer website (external link)
  wcBrandSlug: string | null; // WooCommerce brand slug → /produk-dan-layanan?brand=<slug>
}

/** Fetch brands from WooCommerce Brands API (primary source). */
export async function getWCBrands(): Promise<MerekItem[]> {
  if (!baseUrl || !consumerKey || !consumerSecret) return [];
  try {
    const url = new URL(`${baseUrl}/wp-json/wc/v3/products/brands`);
    url.searchParams.set("consumer_key", consumerKey);
    url.searchParams.set("consumer_secret", consumerSecret);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("orderby", "name");
    url.searchParams.set("order", "asc");
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "Next.js WooCommerce Client" },
      next: { tags: ["woocommerce", "brands"], revalidate: 3600 },
    });
    if (!res.ok) return [];
    const brands = await res.json();
    return (brands as Record<string, any>[]).map((b) => ({
      id: b.id,
      name: decodeHtmlEntities(b.name),
      logoUrl: b.image?.src ?? null,
      brandUrl: null,
      wcBrandSlug: b.slug,
    }));
  } catch {
    return [];
  }
}

/** Legacy: fetch brands from custom WordPress CPT (fallback). */
export async function getMerekItems(): Promise<MerekItem[]> {
  if (!baseUrl) return [];
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/merek_produk?_embed&per_page=100&orderby=menu_order&order=asc`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["merek"], revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((p: Record<string, any>) => ({
      id: p.id,
      name: decodeHtmlEntities(p.title.rendered),
      logoUrl: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
      brandUrl: p.meta?.brand_url || null,
      wcBrandSlug: p.meta?.wc_brand_slug || null,
    }));
  } catch {
    return [];
  }
}

