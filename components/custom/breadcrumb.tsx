// Reusable breadcrumb component — renders both visual shadcn/ui breadcrumb and JSON‑LD structured data
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export interface BreadcrumbItemType {
  label: string;
  href?: string; // relative path, e.g. "/produk-dan-layanan"
}

interface BreadcrumbNavProps {
  items: BreadcrumbItemType[];
}

export function CustomBreadcrumb({ items }: BreadcrumbNavProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href ? `${siteUrl}${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          {items.map((item, i) => (
            <Fragment key={i}>
              <BreadcrumbItem>
                {i === items.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href || "#"}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {i < items.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}