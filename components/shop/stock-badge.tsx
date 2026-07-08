import type { Product } from "@/lib/woocommerce.d";
import { isProductInStock, getProductStockMessage } from "@/lib/woocommerce-utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StockBadgeProps {
  product: Product;
  showQuantity?: boolean;
  className?: string;
}

export function StockBadge({
  product,
  showQuantity = false,
  className,
}: StockBadgeProps) {
  const inStock = isProductInStock(product);
  const message = getProductStockMessage(product);

  const isLowStock =
    product.manage_stock &&
    product.stock_quantity !== null &&
    product.stock_quantity <= (product.low_stock_amount || 3) &&
    product.stock_quantity > 0;

  const isBackorder = product.stock_status === "onbackorder";

  return (
    <div className={cn("flex items-center gap-2 mt-4", className)}>
      {inStock ? (
        <Badge
          variant={isLowStock ? "outline" : "secondary"}
          className={cn(
            isLowStock && "border-yellow-500 dark:border-yellow-600 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950"
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full mr-2",
              isLowStock ? "bg-yellow-500" : "bg-green-500"
            )}
          />
          {message}
        </Badge>
      ) : isBackorder ? (
        <Badge variant="outline" className="border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
          {message}
        </Badge>
      ) : (
        <Badge variant="destructive">
          <span className="w-2 h-2 rounded-full bg-red-300 mr-2" />
          {message}
        </Badge>
      )}
    </div>
  );
}
