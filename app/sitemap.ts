import { MetadataRoute } from "next";
import { getAllPostsForSitemap } from "@/lib/wordpress";
import { getAllProductSlugs } from "@/lib/woocommerce";
import { getPortofolioItems } from "@/lib/custom/portofolio";
import { getAllLayananItems } from "@/lib/custom/layanan";
import { siteConfig } from "@/site.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, productSlugs, portofolioItems, layananItems] = await Promise.all([
    getAllPostsForSitemap(),
    getAllProductSlugs(),
    getPortofolioItems(),
    getAllLayananItems(),
  ]);

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.site_domain}/pages`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/posts/authors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/posts/categories`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/posts/tags`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/portofolio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.site_domain}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.site_domain}/posts/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const productUrls: MetadataRoute.Sitemap = productSlugs.map(({ slug }) => ({
    url: `${siteConfig.site_domain}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const portofolioUrls: MetadataRoute.Sitemap = portofolioItems.map((item) => ({
    url: `${siteConfig.site_domain}/portofolio/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const layananUrls: MetadataRoute.Sitemap = layananItems.map((item) => ({
    url: `${siteConfig.site_domain}/produk-dan-layanan/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticUrls, ...postUrls, ...productUrls, ...portofolioUrls, ...layananUrls];
}
