// CUSTOM: redesigned to match original ilife.co.id masonry photo grid layout
import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getAllProducts } from "@/lib/woocommerce";
import { wcImagesUnoptimized } from "@/lib/utils";

export async function FeaturedProductsSection() {
  // Try featured first, fall back to latest 8
  let products = await getFeaturedProducts(8).catch(() => []);
  if (products.length === 0) {
    products = await getAllProducts().catch(() => []);
    products = products.slice(0, 8);
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Centered title with decorative underline — matches original */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-normal text-gray-800 mb-4">
            Produk-produk
          </h2>
          <hr className="w-12 border-t-2 border-gray-400 mx-auto mb-4" />
        </div>

        {/* Masonry grid: first 2 items at half-width, rest at one-third */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          {products.map((product, i) => {
            const img = product.images[0];
            const categoryName = product.categories.find(
              (c) => c.slug !== "uncategorized"
            )?.name ?? null;
            const isWide = i < 2;

            return (
              <Link
                key={product.id}
                href={`/produk-dan-layanan/${product.slug}`}
                className={[
                  "relative overflow-hidden group block",
                  isWide ? "sm:col-span-3 aspect-[16/10]" : "sm:col-span-2 aspect-[4/3]",
                ].join(" ")}
              >
                {img?.src ? (
                  <Image
                    src={img.src}
                    alt={img.alt || product.name}
                    fill
                    sizes={isWide
                      ? "(max-width: 640px) 100vw, 460px"
                      : "(max-width: 640px) 100vw, 320px"
                    }
                    unoptimized={wcImagesUnoptimized}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={i < 2}
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground text-sm">
                    {product.name}
                  </div>
                )}
                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 px-4 py-2.5 flex items-center gap-2.5">
                  {categoryName && (
                    <span className="shrink-0 text-xs font-bold text-white bg-blue-600 rounded px-2 py-0.5">
                      {categoryName}
                    </span>
                  )}
                  <span className="text-sm text-gray-700 truncate">
                    {product.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/produk-dan-layanan"
            className="inline-block border border-[#17a2b8] text-[#17a2b8] hover:bg-[#17a2b8] hover:text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors duration-200"
          >
            Lihat Semua
          </Link>
        </div>
      </div>
    </section>
  );
}
