"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProdukItem } from "@/lib/custom/produk";

interface ProdukCardProps {
  item: ProdukItem;
  waNumber: string;
  priority?: boolean;
}

export function ProdukCard({ item, waNumber, priority = false }: ProdukCardProps) {
  const waMessage = item.whatsappMessage ||
    `Halo, saya tertarik dengan produk: ${item.title}. Mohon informasi lebih lanjut.`;
  const waUrl = `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodeURIComponent(waMessage)}`;

  const productUrl = item.wcProductSlug ? `/produk-dan-layanan/${item.wcProductSlug}` : "/produk-dan-layanan";

  return (

    <div className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 text-sm">
          </div>
        )}

        {/* Badge overlay */}
        {item.badgeLabel && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-black/70 text-white border-0 text-xs font-mono tracking-wide px-2 py-1">
              {item.badgeLabel}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 mb-1">
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.excerpt}</p>
          )}
        </div>

        {/* Price */}
        {item.priceLabel && (
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.priceLabel}</p>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Link href={productUrl}>
              <ShoppingCart className="w-4 h-4" />
              Tambah ke Keranjang
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-green-600 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-600 hover:text-white gap-2"
          >
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                sendGAEvent("event", "whatsapp_click", {
                  product_name: item.title,
                  product_id: item.id,
                  source: "produk_card",
                })
              }
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
