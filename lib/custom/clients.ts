import { decodeHtmlEntities } from "@/lib/utils";

const baseUrl = process.env.WORDPRESS_URL;

export interface ClientData {
  id: number;
  name: string;
  logoUrl: string | null;
  clientUrl: string | null;
}

export async function getClients(): Promise<ClientData[]> {
  if (!baseUrl) return [];
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/clients?_embed&per_page=100&orderby=menu_order&order=asc`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["clients"], revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((p: any) => ({
      id: p.id,
      name: decodeHtmlEntities(p.title.rendered),
      logoUrl: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
      clientUrl: p.meta?.client_url || null,
    }));
  } catch {
    return [];
  }
}