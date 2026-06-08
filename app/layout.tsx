import "./globals.css";

import { Inter as FontSans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { CartProvider } from "@/components/shop";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { LiveChatWidget } from "@/components/custom/live-chat";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

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
      <head />
      <body className={cn("min-h-screen font-sans antialiased", font.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CartProvider>
            <Nav />
            {children}
            <Footer />
            <LiveChatWidget />
          </CartProvider>
        </ThemeProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
