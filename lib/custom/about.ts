const baseUrl = process.env.WORDPRESS_URL;

export interface AboutData {
  title: string;
  subtitle: string;
  paragraph_1: string;
  paragraph_2: string;
  highlights: string[];
  button_text: string;
  button_url: string;
}

export async function getAboutData(): Promise<AboutData | null> {
  if (!baseUrl) return null;
  try {
    const res = await fetch(`${baseUrl}/wp-json/ilife/v1/about`, {
      headers: { "User-Agent": "Next.js WordPress Client" },
      next: { tags: ["about"], revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}