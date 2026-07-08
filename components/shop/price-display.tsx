import { formatPrice, calculateDiscountPercentage } from "@/lib/woocommerce-utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: string;
  regularPrice: string;
  salePrice: string;
  onSale: boolean;
  priceHtml?: string;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export function PriceDisplay({
  price,
  regularPrice,
  salePrice,
  onSale,
  priceHtml,
  size = "md",
  showBadge = true,
}: PriceDisplayProps) {
  const discountPercentage = onSale
    ? calculateDiscountPercentage(regularPrice, salePrice)
    : 0;

  const sizeClasses = {
    sm: {
      price: "text-base",
      original: "text-sm",
    },
    md: {
      price: "text-xl",
      original: "text-base",
    },
    lg: {
      price: "text-3xl",
      original: "text-lg",
    },
  };

  if (!price && !regularPrice) {
    return (
      <span className={cn("font-semibold", sizeClasses[size].price, "block")}>
        Hubungi kami untuk harga 
      </span>
    );
  }

  // CUSTOM: WooCommerce variable products expose range pricing in price_html.
  // We strip the HTML and extract raw numeric amounts rather than rendering
  // the raw HTML (which includes WooCommerce's hidden aria-label spans).
  if (!onSale && priceHtml) {
    const amounts = priceHtml.match(/[\d.,]+/g)?.map((n) => n.replace(/\./g, "").replace(",", ".")) ?? [];
    const [minRaw, maxRaw] = amounts;
    if (minRaw && maxRaw && minRaw !== maxRaw) {
      return (
        <span className={cn("font-bold", sizeClasses[size].price, "block")}>
          {formatPrice(minRaw)} - {formatPrice(maxRaw)}
        </span>
      );
    }
    if (minRaw) {
      return (
        <span className={cn("font-bold", sizeClasses[size].price, "block")}>
          {formatPrice(minRaw)}
        </span>
      );
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {onSale ? (
        <>
          <span
            className={cn(
              "font-bold text-destructive",
              sizeClasses[size].price
            )}
          >
            {formatPrice(salePrice)}
          </span>
          <span
            className={cn(
              "text-muted-foreground line-through",
              sizeClasses[size].original
            )}
          >
            {formatPrice(regularPrice)}
          </span>
          {showBadge && discountPercentage > 0 && (
            <Badge variant="destructive">Hemat {discountPercentage}%</Badge>
          )}
        </>
      ) : (
        <span className={cn("font-bold", sizeClasses[size].price, "block")}>
          {formatPrice(price || regularPrice)}
        </span>
      )}
    </div>
  );
}
