"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PortofolioItem } from "@/lib/custom/portofolio";

interface PortofolioGalleryProps {
  items: PortofolioItem[];
  kategoriList: string[];
}

export function PortofolioGallery({
  items,
  kategoriList,
}: PortofolioGalleryProps) {
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  const filteredItems = React.useMemo(() => {
    if (!activeFilter) return items;
    return items.filter((item) => item.kategori === activeFilter);
  }, [items, activeFilter]);

  return (
    <div className="w-full">
      {/* Filter buttons */}
      {kategoriList.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={activeFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(null)}
            className="rounded-full"
          >
            Semua
          </Button>
          {kategoriList.map((kategori) => (
            <Button
              key={kategori}
              variant={activeFilter === kategori ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(kategori)}
              className="rounded-full"
            >
              {kategori}
            </Button>
          ))}
        </div>
      )}

      {/* Gallery grid */}
      {filteredItems.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">
          Belum ada proyek yang ditampilkan.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/portofolio/${item.slug}`}
              className="group relative block aspect-square overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  {item.title}
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-black/50 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="line-clamp-2 text-sm font-semibold text-white">
                  {item.title}
                </p>
                {item.clientName && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-white/80">
                    {item.clientName}
                    {item.tahun ? ` · ${item.tahun}` : ""}
                  </p>
                )}
                {item.excerpt && (
                  <p className="mt-1 line-clamp-2 text-xs text-white/70">
                    {item.excerpt}
                  </p>
                )}
                <span className="mt-2 text-xs font-medium text-white underline underline-offset-2">
                  Lihat detail →
                </span>
              </div>

              {/* Category badge */}
              {item.kategori && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.kategori}
                  </Badge>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
