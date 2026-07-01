import { Inter as FontSans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { CartProvider } from "@/components/shop";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";


import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

import "./globals.css";
import "./gutenberg.css";

import { LiveChatWidget } from "@/components/custom/live-chat-wrapper";

const font = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: 'iLife Advertising | Jasa Videotron, Huruf Timbul & Neonbox',
    template: `%s | ${siteConfig.site_name}`,
  },
  description: siteConfig.site_description,
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "iLife Advertising | Jasa Videotron, Huruf Timbul, Neonbox, Signage",
    description: siteConfig.site_description,
    url: siteConfig.site_domain,
    siteName: siteConfig.site_name,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: siteConfig.site_name,
              description: siteConfig.site_description,
              url: siteConfig.site_domain,
              telephone: siteConfig.telephone,
              email: siteConfig.email,
              image: `${siteConfig.site_domain}/og-image.jpg`,
              logo: `${siteConfig.site_domain}/logo.png`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Jl. Kol. Sunandar",
                addressLocality: "Blora",
                addressRegion: "Jawa Tengah",
                postalCode: "58211",
                addressCountry: "ID",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -6.9727629,
                longitude: 111.41185,
              },
              areaServed: [
                // Primary — Central Java cities
                "Blora", "Sragen", "Sukoharjo", "Solo", "Surakarta",
                "Salatiga", "Semarang", "Kudus", "Pati", "Rembang",
                "Grobogan", "Demak", "Jepara", "Boyolali", "Klaten",
                "Wonogiri", "Karanganyar", "Purwodadi", "Jawa Tengah",
                // Broader reach
                "Indonesia", "Kalimantan", "Sulawesi", "Sumatera", "Bali", "Nusa Tenggara"
              ],
              serviceType: [
                "Videotron", "Huruf Timbul", "Neonbox", "Running Text",
                "Neonflex", "Totem SPBU", "Laser Cut", "Signage", "Print UV", "Sticker"
              ],
              sameAs: [
                siteConfig.instagram
                  ? `https://instagram.com/${siteConfig.instagram.replace(/^@/, "")}`
                  : undefined,
                siteConfig.facebook ?? undefined,
                siteConfig.tiktok ?? undefined,
              ].filter(Boolean),
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "08:00",
                  closes: "17:00",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={cn("min-h-screen font-sans antialiased", font.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <Nav />
            {children}
            <Footer />
            <LiveChatWidget />
          </CartProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}