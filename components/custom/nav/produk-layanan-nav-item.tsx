"use client";

// CUSTOM: "Produk & Layanan" nav item with dynamic layanan dropdown.
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Package, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LayananItem } from "@/lib/custom/layanan";
import type { ProductCategory } from "@/lib/woocommerce.d";

interface ProdukLayananNavItemProps {
  layananItems?: LayananItem[];
  productCategories?: ProductCategory[];
}

export function ProdukLayananNavItem({
  layananItems = [],
  productCategories = [],
}: ProdukLayananNavItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const isActive =
    pathname.startsWith("/produk-dan-layanan");

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-0.5 px-4 py-2 text-sm font-medium transition-colors duration-150",
          isActive ? "text-[#1565C0] dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:text-[#1565C0] dark:hover:text-blue-400"
        )}
      >
        Produk &amp; Layanan
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 pt-1.5 w-64">
        <div className="overflow-hidden rounded-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
          {/* Kategori produk induk dari WooCommerce */}
          {productCategories.length > 0 ? (
            <div className="border-b border-gray-100 dark:border-gray-700 py-1">
              <p className="px-4 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Produk
              </p>
              <Link
                href="/produk-dan-layanan"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold transition-colors",
                  pathname === "/produk-dan-layanan"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-[#1565C0] dark:text-blue-400"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#1565C0] dark:hover:text-blue-400"
                )}
              >
                <Package className="h-4 w-4 shrink-0 text-[#1565C0] dark:text-blue-400" />
                <span>Lihat Semua Produk</span>
              </Link>
              {productCategories.map((category) => {
                const href = `/produk-dan-layanan?category=${category.slug}`;
                const itemActive = false;

                return (
                  <Link
                    key={category.id}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors",
                      itemActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-[#1565C0] dark:text-blue-400"
                        : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#1565C0] dark:hover:text-blue-400"
                    )}
                  >
                    <Package className="h-4 w-4 shrink-0 text-[#1565C0] dark:text-blue-400" />
                    <span>{category.name}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Link
              href="/produk-dan-layanan"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-3 text-sm font-semibold transition-colors border-b border-gray-100 dark:border-gray-700",
                pathname === "/produk-dan-layanan"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-[#1565C0] dark:text-blue-400"
                  : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#1565C0] dark:hover:text-blue-400"
              )}
            >
              <Package className="h-4 w-4 shrink-0 text-[#1565C0] dark:text-blue-400" />
              <span>Produk</span>
            </Link>
          )}

          {/* Layanan dinamis dari WP CPT */}
          {layananItems.length > 0 && (
            <div>
              <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Layanan
              </p>
              {layananItems.map((item) => {
                const href = `/produk-dan-layanan/${item.slug}`;
                const itemActive = pathname === href;
                return (
                  <Link
                    key={item.slug}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-start gap-2.5 px-4 py-2.5 text-sm transition-colors",
                      itemActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-[#1565C0] dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#1565C0] dark:hover:text-blue-400"
                    )}
                  >
                    <Wrench className="h-4 w-4 shrink-0 text-[#1565C0] dark:text-blue-400" />
                    <span className="font-medium leading-snug">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
}
