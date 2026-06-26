import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/woocommerce.d";
import { cn, wcImagesUnoptimized } from "@/lib/utils"; // CUSTOM: wcImagesUnoptimized bypasses SSRF in dev
import { formatPrice, calculateDiscountPercentage, isProductInStock } from "@/lib/woocommerce-utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const inStock = isProductInStock(product);
  const discountPercentage = product.on_sale
    ? calculateDiscountPercentage(product.regular_price, product.sale_price)
    : 0;

  const primaryImage = product.images[0];

  return (
    // CUSTOM: public-facing URL is /produk-dan-layanan, not /shop
    <Link
      href={`/produk-dan-layanan/${product.slug}`}
      className={cn(
        "group flex flex-col border rounded-lg overflow-hidden bg-accent/30",
        "hover:bg-accent/75 transition-all"
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {primaryImage?.src ? (
          <Image
            src={primaryImage.src}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            unoptimized={wcImagesUnoptimized}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
            Tidak ada gambar tersedia
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.on_sale && discountPercentage > 0 && (
            <Badge variant="destructive">-{discountPercentage}%</Badge>
          )}
          {product.featured && <Badge variant="secondary">Featured</Badge>}
          {!inStock && <Badge variant="outline">Out of Stock</Badge>}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {/* Category */}
        {product.categories[0] && (
          <span className="text-xs text-muted-foreground">
            {product.categories[0].name}
          </span>
        )}

        {/* Name */}
        <h3 className="font-medium line-clamp-2 group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          {product.type === "variable" && product.price_html ? (
            // CUSTOM: Parse range from price_html to avoid rendering WC aria spans.
            (() => {
              const amounts = product.price_html.match(/[\d.,]+/g)?.map((n) => n.replace(/\./g, "").replace(",", ".")) ?? [];
              const [minRaw, maxRaw] = amounts;
              const label = minRaw && maxRaw && minRaw !== maxRaw
                ? `${formatPrice(minRaw)} – ${formatPrice(maxRaw)}`
                : minRaw ? formatPrice(minRaw) : "Hubungi kami untuk harga";
              return <span className="font-semibold">{label}</span>;
            })()
          ) : product.on_sale ? (
            <>
              <span className="font-semibold text-destructive">
                {formatPrice(product.sale_price)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.regular_price)}
              </span>
            </>
          ) : (
            <span className="font-semibold">
              {product.price ? formatPrice(product.price) : "Hubungi kami untuk harga"}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating_count > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="text-yellow-500">★</span>
            <span>{product.average_rating}</span>
            <span>({product.rating_count})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
