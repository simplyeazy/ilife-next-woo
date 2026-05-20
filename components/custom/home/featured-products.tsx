import Link from "next/link";
import { getFeaturedProducts, getAllProducts } from "@/lib/woocommerce";
import { ProductCard } from "@/components/shop/product-card";

export async function FeaturedProductsSection() {
  // Try featured first, fall back to latest 8
  let products = await getFeaturedProducts(8).catch(() => []);
  if (products.length === 0) {
    products = await getAllProducts().catch(() => []);
    products = products.slice(0, 8);
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-accent/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
              Produk-produk
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Produk unggulan kami
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    </section>
  );
}
