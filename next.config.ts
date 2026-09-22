import type { NextConfig } from "next";

const wordpressHostname =
  process.env.WORDPRESS_HOSTNAME || "us1.wpdemo.org";
const wordpressUrl = process.env.WORDPRESS_URL;
const isLocalDev = wordpressHostname === "localhost" || wordpressHostname === "wordpress";

const nextConfig: NextConfig = {
  output: "standalone",
  // CUSTOM: build robustness for the Hostinger pipeline.
  // api.ilife.co.id (WordPress + WooCommerce) runs on shared MySQL with a low connection limit.
  // Next's defaults (4 export workers x maxConcurrency 8 => ~32 pages rendered in parallel, no
  // retries, exit-on-first-error) exhausted those connections, so /shop/[slug] prerendering
  // failed with `WooCommerceAPIError: <h1>Error establishing a database connection</h1>`
  // (status 500, code wp_die) and `prerenderEarlyExit` aborted the entire deploy.
  // Measured: 24 parallel WC REST calls => 8x HTTP 500; single calls => 200 in ~0.1s.
  // Throttle to one export worker rendering 2 pages at a time, retry transient failures, and
  // never kill the build on a transient backend error (those pages are ISR-rendered on demand).
  experimental: {
    /** Minimum pages per export batch; 100 keeps a build with <=100 prerenderable pages on 1 worker. */
    staticGenerationMinPagesPerWorker: 100,
    /** Pages rendered in parallel per export worker (Next default: 8). */
    staticGenerationMaxConcurrency: 2,
    /** Retry transient prerender failures (Next default: 1 = no retry). */
    staticGenerationRetryCount: 3,
    /** Keep building when a single page fails instead of exiting the build (Next default: true). */
    prerenderEarlyExit: false,
  },
  images: {
    remotePatterns: isLocalDev
      ? [
          {
            protocol: "http",
            hostname: "wordpress",
            port: "",
            pathname: "/**",
          },
          // Keep localhost:8080 for browser-side rendering (client components)
          {
            protocol: "http",
            hostname: "localhost",
            port: "8080",
            pathname: "/**",
          },
        ]
      : [
          {
            protocol: "https",
            hostname: wordpressHostname,
            port: "",
            pathname: "/**",
          },
        ],
  },
  // CUSTOM: /produk-dan-layanan is the public-facing URL; /shop is kept for upstream compatibility
  async rewrites() {
    return [
      { source: "/produk-dan-layanan", destination: "/shop" },
      { source: "/produk-dan-layanan/:path*", destination: "/shop/:path*" },
      // CUSTOM: /artikel is the public-facing URL; /posts is kept for upstream compatibility
      { source: "/artikel", destination: "/posts" },
      { source: "/artikel/:path*", destination: "/posts/:path*" },
    ];
  },
  async redirects() {
    const rules: { source: string; destination: string; permanent: boolean }[] = [
      // CUSTOM: redirect legacy /shop, /produk, and /layanan URLs to /produk-dan-layanan
      { source: "/shop", destination: "/produk-dan-layanan", permanent: true },
      { source: "/shop/:path*", destination: "/produk-dan-layanan/:path*", permanent: true },
      { source: "/produk", destination: "/produk-dan-layanan", permanent: true },
      { source: "/produk/:path*", destination: "/produk-dan-layanan/:path*", permanent: true },
      { source: "/layanan/:path*", destination: "/produk-dan-layanan/:path*", permanent: true },
      // CUSTOM: redirect legacy /post and /posts URLs to /artikel
      { source: "/post", destination: "/artikel", permanent: true },
      { source: "/post/:path*", destination: "/artikel/:path*", permanent: true },
      { source: "/posts", destination: "/artikel", permanent: true },
      { source: "/posts/:path*", destination: "/artikel/:path*", permanent: true },
    ];
    if (wordpressUrl) {
      rules.push({
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      });
    }
    return rules;
  },
  // CUSTOM: tell crawlers not to index /shop/* (internal-only path; public URL is /produk-dan-layanan)
  async headers() {
    return [
      {
        source: "/shop",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/shop/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
    ];
  },
};

export default nextConfig;
