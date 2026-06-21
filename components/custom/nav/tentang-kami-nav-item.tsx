"use client";

// CUSTOM: "Tentang Kami" nav item with dropdown sub-menu.
// Uses plain state instead of Radix NavigationMenu to avoid SSR/client ID mismatch.
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { tentangKamiSubMenu } from "@/menu.config";
import { cn } from "@/lib/utils";

export function TentangKamiNavItem() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const isActive = tentangKamiSubMenu.some((item) =>
    pathname.startsWith(item.href)
  );

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
          isActive ? "text-[#1565C0]" : "text-gray-700 hover:text-[#1565C0]"
        )}
      >
        Tentang Kami
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 pt-1.5 w-56">
        <div className="overflow-hidden rounded-md border bg-white shadow-lg">
          {tentangKamiSubMenu.map((item) => {
            const itemActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-2.5 text-sm font-medium transition-colors",
                  itemActive
                    ? "bg-blue-50 text-[#1565C0]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#1565C0]"
                )}
              >
                {item.label}
                <p className="mt-0.5 text-xs font-normal text-gray-500">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
        </div>
      )}
    </div>
  );
}
