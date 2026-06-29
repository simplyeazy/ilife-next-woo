import type { Metadata } from "next";

import {
  getProducts,
  getAllProductCategories,
  getAllProductTags,
  getProductCategoryBySlug,
  getProductTagBySlug,
  getAbsolutePriceRange,
} from "@/lib/woocommerce";
import { decodeHtmlEntities } from "@/lib/utils";

import { Section, Container, Prose } from "@/components/craft";
import { ProductGrid, ProductFilters } from "@/components/shop";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { siteConfig } from "@/site.config";

// CUSTOM: replaced static metadata with dynamic generateMetadata for category/tag/search pages
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    search?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const { category, tag, search } = params;

  let title = "Produk & Layanan";
  let description = "Temukan produk LED display, videotron, neonbox dan signage terbaik dari iLife. Kualitas premium untuk kebutuhan periklanan dan pertunjukan publik Anda.";
  let canonical = "/produk-dan-layanan";

  if (category) {
    const categoryData = await getProductCategoryBySlug(category);
    if (categoryData) {
      const catName = decodeHtmlEntities(categoryData.name);
      title = `${catName} - Produk & Layanan`;
      description = `Lihat koleksi produk ${catName} dari iLife. Temukan LED display, videotron, neon box, dan signage berkualitas premium untuk kebutuhan bisnis Anda.`;
    } else {
      title = `Kategori: ${category} - Produk & Layanan`;
    }
    canonical = `/produk-dan-layanan?category=${encodeURIComponent(category)}`;
  }

  if (tag) {
    const tagData = await getProductTagBySlug(tag);
    if (tagData) {
      const tagName = decodeHtmlEntities(tagData.name);
      title = `Tag: ${tagName} - Produk & Layanan`;
      description = `Jelajahi semua produk dengan tag ${tagName} dari iLife.`;
    } else {
      title = `Tag: ${tag} - Produk & Layanan`;
    }
    canonical = `/produk-dan-layanan?tag=${encodeURIComponent(tag)}`;
  }

  if (search) {
    title = `Cari: ${search} - Produk & Layanan`;
    description = `Hasil pencarian untuk "${search}" di katalog produk iLife. Temukan produk yang Anda butuhkan.`;
    canonical = `/produk-dan-layanan?search=${encodeURIComponent(search)}`;
  }

  // If multiple filters active, combine them
  if (category && tag) {
    const categoryData = await getProductCategoryBySlug(category);
    const tagData = await getProductTagBySlug(tag);
    const catName = categoryData ? decodeHtmlEntities(categoryData.name) : category;
    const tagName = tagData ? decodeHtmlEntities(tagData.name) : tag;
    title = `${catName} - ${tagName} - Produk & Layanan`;
    description = `Produk ${catName} dengan tag ${tagName} dari iLife. Kualitas premium untuk kebutuhan Anda.`;
    canonical = `/produk-dan-layanan?category=${encodeURIComponent(category)}&tag=${encodeURIComponent(tag)}`;
  }

  if (search && category) {
    const categoryData = await getProductCategoryBySlug(category);
    const catName = categoryData ? decodeHtmlEntities(categoryData.name) : category;
    title = `Cari: ${search} di ${catName} - Produk & Layanan`;
    canonical = `/produk-dan-layanan?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`;
  }

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: canonical,
      siteName: siteConfig.site_name,
      type: "website",
    },
  };
}

export const dynamic = "auto";
export const revalidate = 600;

interface ShopPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
    sort?: string;
    min_price?: string;
    max_price?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const {
    page: pageParam,
    category,
    tag,
    search,
    sort,
    min_price,
    max_price,
  } = params;

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const productsPerPage = 12;

  // Parse sort parameter
  let orderby: "date" | "price" | "popularity" | "rating" | undefined;
  let order: "asc" | "desc" | undefined;

  switch (sort) {
    case "popularity":
      orderby = "popularity";
      break;
    case "rating":
      orderby = "rating";
      break;
    case "date":
      orderby = "date";
      order = "desc";
      break;
    case "price":
      orderby = "price";
      order = "asc";
      break;
    case "price-desc":
      orderby = "price";
      order = "desc";
      break;
  }

  // Resolve category and tag slugs to IDs
  const [categoryData, tagData] = await Promise.all([
    category ? getProductCategoryBySlug(category) : undefined,
    tag ? getProductTagBySlug(tag) : undefined,
  ]);

  const baseParams = {
    category: categoryData?.id,
    tag: tagData?.id,
    search,
  };

  // Fetch products and price range in parallel.
  // getAbsolutePriceRange scans ALL products + variations so the slider always
  // reflects the true catalog-wide min/max regardless of active filters.
  const [productsResponse, categories, tags, { min: absoluteMinPrice, max: absoluteMaxPrice }] =
    await Promise.all([
      getProducts(page, productsPerPage, {
        ...baseParams,
        orderby,
        order,
        min_price: min_price ? parseFloat(min_price) : undefined,
        max_price: max_price ? parseFloat(max_price) : undefined,
      }),
      getAllProductCategories(),
      getAllProductTags(),
      getAbsolutePriceRange(),
    ]);

  const { data: products, headers } = productsResponse;
  const { total, totalPages } = headers;

  // Create pagination URL helper
  const createPaginationUrl = (newPage: number) => {
    const urlParams = new URLSearchParams();
    if (newPage > 1) urlParams.set("page", newPage.toString());
    if (category) urlParams.set("category", category);
    if (tag) urlParams.set("tag", tag);
    if (search) urlParams.set("search", search);
    if (sort) urlParams.set("sort", sort);
    if (min_price) urlParams.set("min_price", min_price);
    if (max_price) urlParams.set("max_price", max_price);
    return `/produk-dan-layanan${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;
  };

  const pageTitle = categoryData?.name || "Produk & Layanan";

  return (
    <Section>
      <Container>
        <div className="space-y-8">
          <Prose>
            <h1>{pageTitle}</h1>
            <p className="text-muted-foreground">
              {total} produk ditemui
              {search && ` untuk "${search}"`}
            </p>
          </Prose>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar Filters */}
            <aside className="space-y-6">
              <ProductFilters
                categories={categories}
                tags={tags}
                currentCategory={category}
                currentTag={tag}
                currentSearch={search}
                currentSort={sort}
                currentMinPrice={min_price}
                currentMaxPrice={max_price}
                absoluteMinPrice={absoluteMinPrice}
                absoluteMaxPrice={absoluteMaxPrice}
              />
            </aside>

            {/* Product Grid */}
            <div className="space-y-8">
              <ProductGrid products={products} columns={3} />

              {totalPages > 1 && (
                <div className="flex justify-center items-center py-8">
                  <Pagination>
                    <PaginationContent>
                      {page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href={createPaginationUrl(page - 1)}
                          />
                        </PaginationItem>
                      )}

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((pageNum) => {
                          return (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            Math.abs(pageNum - page) <= 1
                          );
                        })
                        .map((pageNum, index, array) => {
                          const showEllipsis =
                            index > 0 && pageNum - array[index - 1] > 1;
                          return (
                            <div key={pageNum} className="flex items-center">
                              {showEllipsis && <span className="px-2">...</span>}
                              <PaginationItem>
                                <PaginationLink
                                  href={createPaginationUrl(pageNum)}
                                  isActive={pageNum === page}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            </div>
                          );
                        })}

                      {page < totalPages && (
                        <PaginationItem>
                          <PaginationNext href={createPaginationUrl(page + 1)} />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
