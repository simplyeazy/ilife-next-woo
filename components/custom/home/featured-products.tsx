// CUSTOM: redesigned to match original ilife.co.id masonry photo grid layout
import { getFeaturedProducts, getAllProducts } from "@/lib/woocommerce";
import { FeaturedProductsClient } from "./featured-products-client";

export async function FeaturedProductsSection() {
  // Try featured first, fall back to latest 8
  let products = await getFeaturedProducts(8).catch(() => []);
  if (products.length === 0) {
    products = await getAllProducts().catch(() => []);
    products = products.slice(0, 8);
  }

  if (products.length === 0) return null;

  return <FeaturedProductsClient products={products} />;
}