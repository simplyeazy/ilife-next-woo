const baseUrl = process.env.WORDPRESS_URL;

export interface LogoData {
  src: string;
  alt: string;
}

/**
 * Fetches the active site logo from the WordPress 'logo' CPT.
 * Returns null if no logo post with a featured image exists — the
 * component will fall back to the default SVG in that case.
 */
export async function getLogo(): Promise<LogoData | null> {
  if (!baseUrl) return null;
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/logo?_embed&per_page=1&orderby=date&order=desc`,
      {
        headers: { "User-Agent": "Next.js WordPress Client" },
        next: { tags: ["logo"], revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const posts = await res.json();
    const post = posts[0];
    if (!post) return null;
    const src: string | undefined =
      post.logo_roles?.frontend?.src ??
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    if (!src) return null;
    return {
      src,
      alt:
        post.logo_roles?.frontend?.alt ??
        post.title?.rendered?.replace(/<[^>]+>/g, "").trim() ??
        "Logo",
    };
  } catch {
    return null;
  }
}
