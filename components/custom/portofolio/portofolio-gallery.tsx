"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PortofolioItem } from "@/lib/custom/portofolio";

interface PortofolioGalleryProps {
  items: PortofolioItem[];
  kategoriList: string[];
}

// Framer Motion configuration for the parent grid
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Waktu jeda antar kartu saat muncul
    },
  },
};

// Framer Motion configuration for individual cards
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    }
  },
};

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
            className="rounded-full transition-all"
          >
            Semua
          </Button>
          {kategoriList.map((kategori) => (
            <Button
              key={kategori}
              variant={activeFilter === kategori ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(kategori)}
              className="rounded-full transition-all"
            >
              {kategori}
            </Button>
          ))}
        </div>
      )}

      {/* Gallery grid */}
      {filteredItems.length === 0 ? (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-muted-foreground text-center py-16"
        >
          Belum ada proyek yang ditampilkan.
        </motion.p>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          // We use key here to force re-animation when filters change
          key={activeFilter || "all"} 
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                layout // Smoothly animate layout changes when filtering
              >
                <Link
                  href={`/portofolio/${item.slug}`}
                  className="group relative block aspect-square overflow-hidden rounded-xl bg-muted shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {/* Base Image */}
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                      {item.title}
                    </div>
                  )}

                  {/* Dark Overlay (Dims on hover) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />

                  {/* Content Container (Slides up on hover) */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div className="translate-y-8 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      
                      <h3 className="line-clamp-2 text-lg font-bold text-white leading-tight">
                        {item.title}
                      </h3>
                      
                      {item.clientName && (
                        <p className="mt-1.5 line-clamp-1 text-sm font-medium text-white/90">
                          {item.clientName} {item.tahun ? `• ${item.tahun}` : ""}
                        </p>
                      )}
                      
                      {/* Technical Summary / Excerpt */}
                      {item.excerpt && (
                        <div 
                          className="mt-2 line-clamp-2 text-xs text-white/70"
                          dangerouslySetInnerHTML={{ __html: item.excerpt }} 
                        />
                      )}

                      {/* Action trigger */}
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary-foreground">
                        <span>Lihat detail</span>
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Persistent Category badge (Always visible) */}
                  {item.kategori && (
                    <div className="absolute top-3 right-3 z-10 transition-transform duration-300 group-hover:-translate-y-1">
                      <Badge className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90 shadow-sm border-none">
                        {item.kategori}
                      </Badge>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}