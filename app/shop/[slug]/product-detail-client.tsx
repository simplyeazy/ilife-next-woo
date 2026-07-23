"use client";

import { useState, useCallback } from "react";
import { MessageCircle, Mail, ShoppingBag } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";

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
  const displayPriceHtml = selectedVariation ? undefined : product.price_html;

  // Marketplace URLs: per-product custom field first (full URL), fallback to store ID from env
  const shopeeUrl =
    (product.meta_data.find((m) => m.key === "shopee_url")?.value as string | undefined) ||
    (siteConfig.shopee ? `https://shopee.co.id/${siteConfig.shopee}` : "");
  const tokopediaUrl =
    (product.meta_data.find((m) => m.key === "tokopedia_url")?.value as string | undefined) ||
    (siteConfig.tokopedia ? `https://tokopedia.com/${siteConfig.tokopedia}` : "");

  return (
    <div className="space-y-6">
      {/* Price: show range first, then exact selected variation price */}
      <div className="space-y-2">
        <PriceDisplay
          price={displayPrice}
          regularPrice={displayRegularPrice}
          salePrice={displaySalePrice}
          onSale={isOnSale}
          priceHtml={displayPriceHtml}
          size="md"
        />
      </div>

      {/* Variation Selector */}
      <VariationSelector
        product={product}
        variations={variations}
        onVariationChange={handleVariationChange}
      />

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
          `Halo iLife,\n\nSaya tertarik dengan produk: ${productLabel}.\n\nMohon informasi lebih lanjut mengenai ketersediaan dan harga.\n\nTerima kasih.`
        );
        const emailUrl = `mailto:${SALES_EMAIL}?subject=${emailSubject}&body=${emailBody}`;

        return (
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-md bg-[#25D366] hover:bg-[#1ebe5d] text-white font-medium transition-colors"
              onClick={() =>
                sendGAEvent("event", "whatsapp_click", {
                  product_name: product.name,
                  product_id: product.id,
                  source: "shop_detail",
                })
              }
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><title>WhatsApp</title><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Pesan via WhatsApp
            </a>
            <a
              href={emailUrl}
              className="inline-flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              onClick={()=>
                sendGAEvent("event", "email_click", {
                  product_name: product.name,
                  product_id: product.id,
                  source: "shop_detail",
                })
              }
            >
              <Mail className="h-4 w-4" />
              Kirim Email
            </a>
          </div>
        );
      })()}

      {/* Marketplace trust section — Shopee & Tokopedia */}
      {(shopeeUrl || tokopediaUrl) && (
        <div className="text-center space-y-2 pt-2 border-t border-gray-100">
          <p className="text-sm text-muted-foreground">
            Belanja tanpa khawatir - produk kami juga tersedia di ecommerce terpercaya berikut:
          </p>
          <div className="flex items-center justify-center gap-3">
            {shopeeUrl && (
              <a
                href={shopeeUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#ee4d2d] hover:bg-[#d43f22] text-white text-sm font-medium transition-colors"
                onClick={() =>
                  sendGAEvent("event", "shopee_click", {
                    product_name: product.name,
                    product_id: product.id,
                    source: "shop_detail",
                  })
                }
              >
                <ShoppingBag className="h-4 w-4" />
                Shopee
              </a>
            )}
            {tokopediaUrl && (
              <a
                href={tokopediaUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#42b549] hover:bg-[#359e3b] text-white text-sm font-medium transition-colors"
                onClick={() =>
                  sendGAEvent("event", "tokopedia_click", {
                    product_name: product.name,
                    product_id: product.id,
                    source: "shop_detail",
                  })
                }
              >
                <ShoppingBag className="h-4 w-4" />
                Tokopedia
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
