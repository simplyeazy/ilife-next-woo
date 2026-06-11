import type { NextConfig } from "next";

const wordpressHostname =
  process.env.WORDPRESS_HOSTNAME || "us1.wpdemo.org";
const wordpressUrl = process.env.WORDPRESS_URL;
const isLocalDev = wordpressHostname === "localhost" || wordpressHostname === "wordpress";

const nextConfig: NextConfig = {
  output: "standalone",
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
  // CUSTOM: /produk-dan-layanan is the public-facing URL; /shop is kept for upstream compat
  async rewrites() {
    return [
      { source: "/produk-dan-layanan", destination: "/shop" },
      { source: "/produk-dan-layanan/:path*", destination: "/shop/:path*" },
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
};

export default nextConfig;
