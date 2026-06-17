"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { iLifeMenu } from "@/menu.config";
import { cn } from "@/lib/utils";
import { TentangKamiNavItem } from "@/components/custom/nav/tentang-kami-nav-item";
import { ProdukLayananNavItem } from "@/components/custom/nav/produk-layanan-nav-item";
import type { LayananItem } from "@/lib/custom/layanan";
import type { ProductCategory } from "@/lib/woocommerce.d";

// CUSTOM: these labels are replaced with dropdown components
const DROPDOWN_LABELS = new Set(["Tentang Kami", "Produk & Layanan"]);

interface NavLinksProps {
  layananItems?: LayananItem[];
  productCategories?: ProductCategory[];
}

export function NavLinks({
  layananItems = [],
  productCategories = [],
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center">
      {iLifeMenu.map(({ label, href }) => {
        if (label === "Produk & Layanan") {
          return (
            <ProdukLayananNavItem
              key={href}
              layananItems={layananItems}
              productCategories={productCategories}
            />
          );
        }
        if (label === "Tentang Kami") {
          return <TentangKamiNavItem key={href} />;
        }
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors duration-150",
              isActive
                ? "text-[#1565C0]"
                : "text-gray-700 hover:text-[#1565C0]"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
