// CUSTOM: Extracted from lib/woocommerce.ts — client-safe utilities with no env vars.
// If upstream updates formatPrice/calculateDiscountPercentage/isProductInStock/getProductStockMessage
// in woocommerce.ts, sync those changes here too.
import type { Product } from "./woocommerce.d";

export function formatPrice(
  price: string | number,
  currency: string = "IDR"
): string {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Check for NaN to prevent formatting errors
  if (isNaN(numericPrice)) return ""; 

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
  })
    .format(numericPrice)
    .replace(/\u00a0/g, ""); // Removes the non-breaking space &nbsp;
}

export function calculateDiscountPercentage(
  regularPrice: string,
  salePrice: string
): number {
  const regular = parseFloat(regularPrice);
  const sale = parseFloat(salePrice);

  if (!regular || !sale || regular <= sale) return 0;

  return Math.round(((regular - sale) / regular) * 100);
}

export function isProductInStock(product: Product): boolean {
  if (!product.manage_stock) {
    return product.stock_status === "instock";
  }

  return (
    product.stock_status === "instock" &&
    (product.stock_quantity === null || product.stock_quantity > 0)
  );
}

export function getProductStockMessage(product: Product): string {
  if (!isProductInStock(product)) {
    if (product.stock_status === "onbackorder") {
      return "Tersedia untuk pre-order";
    }
    return "Habis";
  }

  if (product.manage_stock && product.stock_quantity !== null) {
    if (product.stock_quantity <= (product.low_stock_amount || 3)) {
      return `Hanya ${product.stock_quantity} tersisa`;
    }
    return "Stok tersedia";
  }

  return "Stok tersedia";
}
