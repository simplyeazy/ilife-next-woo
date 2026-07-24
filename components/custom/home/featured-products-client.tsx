"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import type { Product } from "@/lib/woocommerce.d";
import { wcImagesUnoptimized } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

export function FeaturedProductsClient({ products }: { products: Product[] }) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        {/* Centered title with decorative underline — matches original */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-normal text-gray-800 dark:text-gray-100 mb-4">
            Produk-produk
          </h2>
          <hr className="w-12 border-t-2 border-gray-400 dark:border-gray-500 mx-auto mb-4" />
        </motion.div>

        {/* Masonry grid: first 2 items at half-width, rest at one-third */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-6 gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {products.map((product, i) => {
            const img = product.images[0];
            const categoryName = product.categories.find(
              (c) => c.slug !== "uncategorized"
            )?.name ?? null;
            const isWide = i < 2;

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className={isWide ? "sm:col-span-3" : "sm:col-span-2"}
              >
                <Link
                  href={`/produk-dan-layanan/${product.slug}`}
                  className={[
                    "relative overflow-hidden group block",
                    isWide ? "aspect-[16/10]" : "aspect-[4/3]",
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
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 px-4 py-2.5 flex items-center gap-2.5">
                    {categoryName && (
                      <span className="shrink-0 text-xs font-bold text-white bg-blue-600 rounded px-2 py-0.5">
                        {categoryName}
                      </span>
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {product.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            href="/produk-dan-layanan"
            className="inline-block border border-[#1565C0] dark:border-blue-400 text-[#1565C0] dark:text-blue-400 hover:bg-[#1565C0] dark:hover:bg-blue-400 hover:text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors duration-200"
          >
            Lihat Semua
          </Link>
        </div>
      </div>
    </section>
  );
}