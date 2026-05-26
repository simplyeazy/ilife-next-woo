type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  whatsapp_number: string; // Indonesian format without leading zero, e.g. "628123456789"
  email: string;
};

export const siteConfig: SiteConfig = {
  site_name: "iLife",
  site_description: "Solusi videotron & layar LED terpercaya untuk periklanan dan pertunjukan publik.",
  site_domain: "https://ilife.co.id",
  // CUSTOM: WhatsApp number for product inquiry CTAs on /produk page
  whatsapp_number: process.env.NEXT_PUBLIC_WA_NUMBER ?? "6289506017899",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
};
