// Define the menu items
export const mainMenu = {
  home: "/",
  shop: "/produk", // CUSTOM: /shop redirects to /produk
  blog: "/posts",
  about: "https://github.com/9d8dev/next-wp",
};

// CUSTOM: iLife main navigation
export const iLifeMenu = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/produk" },
  { label: "Portofolio", href: "/portofolio" },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

// CUSTOM: sub-items under "Tentang Kami" dropdown
export const tentangKamiSubMenu = [
  { label: "Profil Perusahaan", href: "/tentang-kami", description: "Visi, misi, dan profil perusahaan" },
  { label: "Sertifikat", href: "/sertifikat", description: "Sertifikasi dan penghargaan kami" },
];

export const contentMenu = {
  categories: "/posts/categories",
  tags: "/posts/tags",
  authors: "/posts/authors",
};

export const shopMenu = {
  products: "/produk", // CUSTOM: /shop redirects to /produk
  cart: "/cart",
  account: "/account",
};
