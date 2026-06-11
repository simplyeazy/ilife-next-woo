"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import type { ClientData } from "@/lib/custom/clients";
import { wcImagesUnoptimized } from "@/lib/utils";

interface Props {
  clients: ClientData[];
  autoScroll: boolean; // passed from server — true when > 6
}

export function BrandsScrollClient({ clients, autoScroll }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoScroll) return;
    const el = trackRef.current;
    if (!el) return;
    let frame: number;
    let pos = 0;
    const speed = 0.4; // px per frame — tune as needed

    const tick = () => {
      pos += speed;
      // Reset when first copy scrolls fully out
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [autoScroll]);

  // Duplicate items for seamless loop
  const items = autoScroll ? [...clients, ...clients] : clients;

  return (
    <div className={autoScroll ? "overflow-hidden" : ""}>
      <div
        ref={trackRef}
        className={
          autoScroll
            ? "flex gap-10 w-max will-change-transform"
            : "flex flex-wrap justify-center items-center gap-10"
        }
      >
        {items.map((client, i) => {
          const inner = client.logoUrl ? (
            // 1. Lock the bounding box size using a relative wrapper
            <div className="relative w-[120px] h-[80px] flex items-center justify-center">
              <Image
                src={client.logoUrl}
                alt={client.name}
                fill // 2. Switch from fixed width/height to fill
                sizes="(max-width: 768px) 100px, 120px" // 3. Provide accurate breakpoint hints
                quality={60}
                unoptimized={wcImagesUnoptimized}
                // 4. Removed w-auto and max-h. object-contain handles the aspect ratio natively inside the wrapper.
                className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ) : (
            <div className="w-[120px] h-[80px] flex items-center justify-center text-center text-xs font-semibold text-gray-500 border border-gray-200 rounded px-2">
              {client.name}
            </div>
          );

          return client.clientUrl ? (
            <a
              key={`${client.id}-${i}`}
              href={client.clientUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={client.name}
              className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              {inner}
            </a>
          ) : (
            <div key={`${client.id}-${i}`} className="flex-shrink-0">
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}