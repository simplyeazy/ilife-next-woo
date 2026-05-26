"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { iLifeMenu } from "@/menu.config";
import { cn } from "@/lib/utils";
import { TentangKamiNavItem } from "@/components/custom/nav/tentang-kami-nav-item";

// CUSTOM: "Tentang Kami" entry is replaced with a dropdown component
const DROPDOWN_LABELS = new Set(["Tentang Kami"]);

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center">
      {iLifeMenu.map(({ label, href }) => {
        if (DROPDOWN_LABELS.has(label)) {
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
