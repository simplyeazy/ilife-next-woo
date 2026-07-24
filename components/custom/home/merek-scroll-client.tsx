"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import type { MerekItem } from "@/lib/custom/merek";
import { wcImagesUnoptimized } from "@/lib/utils";

interface Props {
  brands: MerekItem[];
  autoScroll: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
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
      <motion.div
        ref={trackRef}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className={
          autoScroll
            ? "flex gap-12 w-max will-change-transform items-center"
            : "flex flex-wrap justify-center items-center gap-12"
        }
      >
        {items.map((brand, i) => {
          // Primary: filter WC products by brand; fallback: manufacturer site
          const href = brand.wcBrandSlug
            ? `/produk-dan-layanan?brand=${brand.wcBrandSlug}`
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
              className="object-contain grayscale hover:grayscale-0 dark:grayscale-0 dark:hover:brightness-110 transition-all duration-300 max-h-[64px] w-auto"
            />
          ) : (
            <div className="w-[120px] h-[64px] flex items-center justify-center text-center text-xs font-semibold text-muted-foreground border rounded px-2">
              {brand.name}
            </div>
          );

          return (
            <motion.a
              key={`${brand.id}-${i}`}
              href={href}
              target={isExternal ? "_blank" : "_self"}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-label={brand.name}
              className="flex-shrink-0"
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {logo}
            </motion.a>
          );
        })}
      </motion.div>
    </div>
  );
}