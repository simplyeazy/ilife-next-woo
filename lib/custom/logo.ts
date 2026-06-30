const baseUrl = process.env.WORDPRESS_URL;

export interface LogoData {
  src: string;
  alt: string;
}

/**
 * Fetches the frontend site logo from the iLife Logo Options API endpoint.
 * Returns null if no logo has been assigned — the component will fall back
 * to the default SVG in that case.
 */
export async function getLogo(): Promise<LogoData | null> {
  if (!baseUrl) return null;
  try {
    const res = await fetch(`${baseUrl}/wp-json/ilife/v1/logo`, {
      headers: { "User-Agent": "Next.js WordPress Client" },
      next: { tags: ["logo"], revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();

    // The response shape: { frontend: { src, alt } | null, admin: …, cms: … }
    const frontendLogo = data?.frontend;

    if (frontendLogo?.src) {
      return {
        src: frontendLogo.src,
        alt: frontendLogo.alt || "Logo",
      };
    }

    return null;
  } catch {
    return null;
  }
}