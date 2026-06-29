import { siteConfig } from "@/site.config";
import type { Metadata } from "next";

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Truncate text to a maximum length, adding ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

interface ContentMetadataOptions {
  title: string;
  excerpt?: string;
  content?: string;
  slug: string;
  type: "post" | "page";
}

/**
 * Generate consistent metadata for posts and pages
 */
export function generateContentMetadata({
  title,
  excerpt,
  content,
  slug,
  type,
}: ContentMetadataOptions): Metadata {
  const description = excerpt
    ? stripHtml(excerpt)
    : content
      ? truncateText(stripHtml(content), 200)
      : "";

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", `${title} | ${siteConfig.site_name}`);
  ogUrl.searchParams.append("description", description);

  // CUSTOM: Use correct path — pages are at root, posts under /posts/
  const path = type === "post" ? `/posts/${slug}` : `/${slug}`;

  return {
    title: `${title} | ${siteConfig.site_name}`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${siteConfig.site_name}`,
      description,
      type: "article",
      url: `${siteConfig.site_domain}${path}`,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.site_name}`,
      description,
      images: [ogUrl.toString()],
    },
  };
}
