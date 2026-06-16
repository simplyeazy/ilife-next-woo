"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Filter, Search, X } from "lucide-react";

import type { ProductCategory, ProductTag } from "@/lib/woocommerce.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  categories: ProductCategory[];
  tags: ProductTag[];
  currentCategory?: string;
  currentTag?: string;
  currentSearch?: string;
  currentSort?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

export function ProductFilters({
  categories,
  tags,
  currentCategory,
  currentTag,
  currentSearch,
  currentSort,
  currentMinPrice,
  currentMaxPrice,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Reset to page 1 when filters change
      params.delete("page");

      startTransition(() => {
        router.push(`/produk-dan-layanan?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    startTransition(() => {
      router.push("/produk-dan-layanan");
    });
  };

  const hasActiveFilters =
    currentCategory ||
    currentTag ||
    currentSearch ||
    currentMinPrice ||
    currentMaxPrice;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#1565C0]" />
          <h3 className="font-semibold text-slate-800 text-lg">Filter Produk</h3>
        </div>
        {isPending && (
          <span className="text-xs font-medium text-[#1565C0] animate-pulse">
            Memuat...
          </span>
        )}
      </div>

      <div className="space-y-5">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-slate-700 font-medium">Pencarian</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="search"
              type="search"
              placeholder="Cari produk..."
              defaultValue={currentSearch}
              className="pl-9 focus-visible:ring-[#1565C0] border-slate-200"
              onChange={(e) => {
                const value = e.target.value;
                const timeoutId = setTimeout(() => {
                  updateFilters({ search: value || undefined });
                }, 300);
                return () => clearTimeout(timeoutId);
              }}
            />
          </div>
        </div>

        {/* Category */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Kategori</Label>
            <Select
              value={currentCategory || "all"}
              onValueChange={(value) =>
                updateFilters({ category: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger className="focus:ring-[#1565C0] border-slate-200">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Tag</Label>
            <Select
              value={currentTag || "all"}
              onValueChange={(value) =>
                updateFilters({ tag: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger className="focus:ring-[#1565C0] border-slate-200">
                <SelectValue placeholder="Semua tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua tag</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.slug}>
                    {tag.name} ({tag.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sort */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium">Urutkan</Label>
          <Select
            value={currentSort || "default"}
            onValueChange={(value) =>
              updateFilters({ sort: value === "default" ? undefined : value })
            }
          >
            <SelectTrigger className="focus:ring-[#1565C0] border-slate-200">
              <SelectValue placeholder="Urutan bawaan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Urutan bawaan</SelectItem>
              <SelectItem value="popularity">Popularitas</SelectItem>
              <SelectItem value="rating">Rating rata-rata</SelectItem>
              <SelectItem value="date">Terbaru</SelectItem>
              <SelectItem value="price">Harga: Rendah ke Tinggi</SelectItem>
              <SelectItem value="price-desc">Harga: Tinggi ke Rendah</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium">Rentang Harga</Label>
          <div className="flex gap-3 items-center">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">Rp</span>
              <Input
                type="number"
                placeholder="Min"
                min={0}
                defaultValue={currentMinPrice}
                onChange={(e) => updateFilters({ min_price: e.target.value || undefined })}
                className="pl-8 focus-visible:ring-[#1565C0] border-slate-200"
              />
            </div>
            <span className="text-slate-400">-</span>
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">Rp</span>
              <Input
                type="number"
                placeholder="Maks"
                min={0}
                defaultValue={currentMaxPrice}
                onChange={(e) => updateFilters({ max_price: e.target.value || undefined })}
                className="pl-8 focus-visible:ring-[#1565C0] border-slate-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-slate-100">
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            disabled={isPending}
          >
            <X className="w-4 h-4 mr-2" />
            Hapus Semua Filter
          </Button>
        </div>
      )}
    </div>
  );
}