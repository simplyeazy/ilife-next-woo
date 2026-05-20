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
          // CUSTOM: iLife original CDN assets (client logos, carousel images)
          {
            protocol: "https",
            hostname: "d33wubrfki0l68.cloudfront.net",
            port: "",
            pathname: "/**",
          },
        ],
  },
  async redirects() {
    if (!wordpressUrl) {
      return [];
    }
    return [
      {
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
