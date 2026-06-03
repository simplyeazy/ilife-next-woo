"use client";

import { useState, useCallback } from "react";
import { MessageCircle } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";

import type { Product, ProductVariation } from "@/lib/woocommerce.d";
import { VariationSelector, AddToCartButton, PriceDisplay, StockBadge } from "@/components/shop";
import { featureFlags, siteConfig } from "@/site.config";

interface ProductDetailClientProps {
  product: Product;
  variations: ProductVariation[];
}

export function ProductDetailClient({
  product,
  variations,
}: ProductDetailClientProps) {
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);

  const handleVariationChange = useCallback(
    (variation: ProductVariation | null) => {
      setSelectedVariation(variation);
    },
    []
  );

  // Show variation price if selected, otherwise show product price range
  const displayPrice = selectedVariation?.price || product.price;
  const displayRegularPrice =
    selectedVariation?.regular_price || product.regular_price;
  const displaySalePrice = selectedVariation?.sale_price || product.sale_price;
  const isOnSale = selectedVariation?.on_sale ?? product.on_sale;

  return (
    <div className="space-y-6">
      {/* Variation Selector */}
      <VariationSelector
        product={product}
        variations={variations}
        onVariationChange={handleVariationChange}
      />

      {/* Updated Price Display */}
      {selectedVariation && (
        <div className="space-y-2">
          <PriceDisplay
            price={displayPrice}
            regularPrice={displayRegularPrice}
            salePrice={displaySalePrice}
            onSale={isOnSale}
            size="md"
          />
        </div>
      )}

      {/* CUSTOM: show WhatsApp CTA when cart is disabled, otherwise AddToCart */}
      {featureFlags.ENABLE_CART ? (
        <AddToCartButton product={product} variation={selectedVariation} />
      ) : (
        <a
          href={`https://wa.me/${siteConfig.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(`Halo, saya tertarik dengan produk: ${product.name}. Mohon informasi lebih lanjut.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-md bg-[#25D366] hover:bg-[#1ebe5d] text-white font-medium transition-colors"
          onClick={() =>
            sendGAEvent("event", "whatsapp_click", {
              product_name: product.name,
              product_id: product.id,
              source: "shop_detail",
            })
          }
        >
          <MessageCircle className="h-5 w-5" />
          Pesan via WhatsApp
        </a>
      )}
    </div>
  );
}
