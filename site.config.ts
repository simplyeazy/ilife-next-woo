type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
  telephone?: string;
  whatsapp_number: string; // Indonesian format without leading zero, e.g. "628123456789"
  email: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  shopee?: string;
};

// CUSTOM: Feature flags — set to true when ready to re-enable each capability
export const featureFlags = {
  /** Show cart icon, CartDrawer, and AddToCart buttons site-wide */
  ENABLE_CART: false,
  /** Allow users to reach /cart and /checkout pages */
  ENABLE_CHECKOUT: false,
  /** Fetch JNE shipping rates during checkout */
  ENABLE_JNE_SHIPPING: false,
  /** Submit orders and redirect to WooCommerce payment gateway (Midtrans, etc.) */
  ENABLE_ONLINE_PAYMENT: false,
};

export const siteConfig: SiteConfig = {
  site_name: "iLife Advertising | Jasa Videotron, Huruf Timbul, Neonbox, Signage",
  site_description: "Spesialis jasa pembuatan videotron, huruf timbul, neonbox, dan signage profesional. Melayani custom running text, neonflex, totem SPBU & laser cut.",
  site_domain: "https://ilife.co.id",
  telephone: process.env.NEXT_PUBLIC_PHONE_OFFICE ?? "",
  // CUSTOM: WhatsApp number for product inquiry CTAs on /produk page
  whatsapp_number: process.env.NEXT_PUBLIC_WA_NUMBER ?? "",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK ?? "",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK ?? "",
  shopee: process.env.NEXT_PUBLIC_SHOPEE ?? "",
};
