"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import type { MerekItem } from "@/lib/custom/merek";
import { wcImagesUnoptimized } from "@/lib/utils";

interface Props {
  brands: MerekItem[];
  autoScroll: boolean;
}

export function MerekScrollClient({ brands, autoScroll }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoScroll) return;
    const el = trackRef.current;
    if (!el) return;
    let frame: number;
    let pos = 0;
    const tick = () => {
      pos += 0.4;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [autoScroll]);

  const items = autoScroll ? [...brands, ...brands] : brands;

  return (
    <div className={autoScroll ? "overflow-hidden" : ""}>
      <div
        ref={trackRef}
        className={
          autoScroll
            ? "flex gap-12 w-max will-change-transform items-center"
            : "flex flex-wrap justify-center items-center gap-12"
        }
      >
        {items.map((brand, i) => {
          // Primary: filter WC products by brand; fallback: manufacturer site
          const href = brand.wcBrandSlug
            ? `/produk?brand=${brand.wcBrandSlug}`
            : (brand.brandUrl ?? "#");
          const isExternal = !brand.wcBrandSlug && !!brand.brandUrl;

          const logo = brand.logoUrl ? (
            <Image
              src={brand.logoUrl}
              alt={brand.name}
              width={200}
              height={64}
              sizes="200px"
              quality={60}
              unoptimized={wcImagesUnoptimized}
              className="object-contain grayscale hover:grayscale-0 transition-all duration-300 max-h-[64px] w-auto"
            />
          ) : (
            <div className="w-[120px] h-[64px] flex items-center justify-center text-center text-xs font-semibold text-muted-foreground border rounded px-2">
              {brand.name}
            </div>
          );

          return (
            <a
              key={`${brand.id}-${i}`}
              href={href}
              target={isExternal ? "_blank" : "_self"}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-label={brand.name}
              className="flex-shrink-0"
            >
              {logo}
            </a>
          );
        })}
      </div>
    </div>
  );
}
