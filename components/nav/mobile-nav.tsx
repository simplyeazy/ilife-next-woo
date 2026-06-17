"use client";

// CUSTOM: updated to use iLife navigation menu
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { iLifeMenu, tentangKamiSubMenu } from "@/menu.config";
import { ILifeLogo } from "@/components/custom/ilife-logo";
import type { LayananItem } from "@/lib/custom/layanan";
import type { ProductCategory } from "@/lib/woocommerce.d";

// Labels that should be replaced with their sub-items in mobile nav
const DROPDOWN_LABELS = new Set(["Tentang Kami", "Produk & Layanan"]);

interface MobileNavProps {
  logoSrc?: string;
  logoAlt?: string;
  layananItems?: LayananItem[];
  productCategories?: ProductCategory[];
}

export function MobileNav({
  logoSrc,
  logoAlt,
  layananItems = [],
  productCategories = [],
}: MobileNavProps = {}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 border w-10 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader>
          <SheetTitle className="text-left">
            <MobileLink href="/" onOpenChange={setOpen}>
              <ILifeLogo src={logoSrc} alt={logoAlt} />
            </MobileLink>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 mt-6 uppercase tracking-wider">
              Menu
            </h3>
            <Separator />
            {iLifeMenu.map(({ label, href }) => {
              if (label === "Produk & Layanan") {
                return (
                  <div key={href}>
                    <MobileLink
                      href="/produk-dan-layanan"
                      onOpenChange={setOpen}
                      className="text-lg font-medium text-gray-800"
                    >
                      Produk &amp; Layanan
                    </MobileLink>
                    {productCategories.length > 0 && (
                      <div className="flex flex-col space-y-1 pl-4 border-l border-gray-200 mt-1">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                          Produk
                        </p>
                        <MobileLink
                          href="/produk-dan-layanan"
                          onOpenChange={setOpen}
                          className="text-base font-medium text-gray-700"
                        >
                          See Produk
                        </MobileLink>
                        {productCategories.map((category) => (
                          <MobileLink
                            key={category.id}
                            href={`/produk-dan-layanan?category=${category.slug}`}
                            onOpenChange={setOpen}
                            className="text-base text-gray-600"
                          >
                            {category.name}
                          </MobileLink>
                        ))}
                      </div>
                    )}
                    {layananItems.length > 0 && (
                      <div className="flex flex-col space-y-1 pl-4 border-l border-gray-200 mt-1">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                          Layanan
                        </p>
                        {layananItems.map((item) => (
                          <MobileLink
                            key={item.slug}
                            href={`/layanan/${item.slug}`}
                            onOpenChange={setOpen}
                            className="text-base text-gray-600"
                          >
                            {item.title}
                          </MobileLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              if (label === "Tentang Kami") {
                return (
                  <div key={href}>
                    <p className="text-lg font-medium text-gray-700 mb-1">
                      {label}
                    </p>
                    <div className="flex flex-col space-y-1 pl-4 border-l border-gray-200">
                      {tentangKamiSubMenu.map((sub) => (
                        <MobileLink
                          key={sub.href}
                          href={sub.href}
                          onOpenChange={setOpen}
                          className="text-base text-gray-600"
                        >
                          {sub.label}
                        </MobileLink>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <MobileLink key={href} href={href} onOpenChange={setOpen}>
                  {label}
                </MobileLink>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-lg", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
