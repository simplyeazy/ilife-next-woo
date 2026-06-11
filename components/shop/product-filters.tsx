"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

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
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Pencarian</Label>
        <Input
          id="search"
          type="search"
          placeholder="Cari produk..."
          defaultValue={currentSearch}
          onChange={(e) => {
            const value = e.target.value;
            // Debounce search
            const timeoutId = setTimeout(() => {
              updateFilters({ search: value || undefined });
            }, 300);
            return () => clearTimeout(timeoutId);
          }}
        />
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select
            value={currentCategory || "all"}
            onValueChange={(value) =>
              updateFilters({ category: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger>
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
          <Label>Tag</Label>
          <Select
            value={currentTag || "all"}
            onValueChange={(value) =>
              updateFilters({ tag: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger>
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
        <Label>Urutkan berdasarkan</Label>
        <Select
          value={currentSort || "default"}
          onValueChange={(value) =>
            updateFilters({ sort: value === "default" ? undefined : value })
          }
        >
          <SelectTrigger>
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
        <Label>Rentang Harga</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            min={0}
            defaultValue={currentMinPrice}
            onChange={(e) => updateFilters({ min_price: e.target.value || undefined })}
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Maks"
            min={0}
            defaultValue={currentMaxPrice}
            onChange={(e) => updateFilters({ max_price: e.target.value || undefined })}
            className="w-full"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
          disabled={isPending}
        >
          Hapus Filter
        </Button>
      )}

      {isPending && (
        <div className="text-sm text-muted-foreground text-center">
          Memuat...
        </div>
      )}
    </div>
  );
}
