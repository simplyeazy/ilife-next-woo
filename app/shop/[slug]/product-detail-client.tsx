"use client";

import { useState, useCallback } from "react";
import { MessageCircle, Mail } from "lucide-react";

import type { Product, ProductVariation } from "@/lib/woocommerce.d";
import { VariationSelector, AddToCartButton, PriceDisplay, StockBadge } from "@/components/shop";
import { featureFlags, siteConfig } from "@/site.config";

const SALES_EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "sales@ilife.co.id";

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

      {/* CUSTOM: show WhatsApp + Email CTAs when cart is disabled, otherwise AddToCart */}
      {featureFlags.ENABLE_CART ? (
        <AddToCartButton product={product} variation={selectedVariation} />
      ) : (() => {
        const variantLabel = selectedVariation
          ? ` (${selectedVariation.attributes.map((a) => a.option).join(", ")})`
          : "";
        const productLabel = `${product.name}${variantLabel}`;

        const waMessage = encodeURIComponent(
          `Halo, saya tertarik dengan produk: ${productLabel}. Mohon informasi lebih lanjut.`
        );
        const waUrl = `https://wa.me/${siteConfig.whatsapp_number.replace(/\D/g, "")}?text=${waMessage}`;

        const emailSubject = encodeURIComponent(`Pertanyaan produk: ${productLabel}`);
        const emailBody = encodeURIComponent(
          `Halo tim iLife,\n\nSaya tertarik dengan produk: ${productLabel}.\n\nMohon informasi lebih lanjut mengenai ketersediaan dan harga.\n\nTerima kasih.`
        );
        const emailUrl = `mailto:${SALES_EMAIL}?subject=${emailSubject}&body=${emailBody}`;

        return (
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-md bg-[#25D366] hover:bg-[#1ebe5d] text-white font-medium transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Pesan via WhatsApp
            </a>
            <a
              href={emailUrl}
              className="inline-flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              <Mail className="h-5 w-5" />
              Kirim Email
            </a>
          </div>
        );
      })()}
    </div>
  );
}
