// CUSTOM: redesigned nav to match iLife branding
import Link from "next/link";
import { MobileNav } from "@/components/nav/mobile-nav";
import { CartDrawer } from "@/components/shop";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { ILifeLogo } from "@/components/custom/ilife-logo";
import { NavLinks } from "@/components/layout/nav-links";
import { getLogo } from "@/lib/custom/logo";
import { getAllLayananItems } from "@/lib/custom/layanan";
import { getAllProductCategories } from "@/lib/woocommerce";
import { featureFlags } from "@/site.config";

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export async function Nav({ className, children, id }: NavProps) {
  const [logo, layananItems, productCategories] = await Promise.all([
    getLogo(),
    getAllLayananItems(),
    getAllProductCategories(),
  ]);

  const parentProductCategories = productCategories
    .filter((category) => category.parent === 0)
    .sort((a, b) => a.menu_order - b.menu_order || a.name.localeCompare(b.name));

  return (
    <nav
      className={cn(
        "sticky z-50 top-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm",
        className
      )}
      id={id}
    >
      <div
        id="nav-container"
        className="max-w-6xl mx-auto py-3 px-6 sm:px-8 flex justify-between items-center"
      >
        <Link
          href="/"
          className="hover:opacity-80 transition-opacity"
          aria-label="iLife beranda"
        >
          <ILifeLogo src={logo?.src} alt={logo?.alt} />
        </Link>
        {children}
        <div className="flex items-center gap-1">
          <NavLinks
            layananItems={layananItems}
            productCategories={parentProductCategories}
          />
          <ThemeToggle />
          {featureFlags.ENABLE_CART && <CartDrawer />}
          <MobileNav
            logoSrc={logo?.src}
            logoAlt={logo?.alt}
            layananItems={layananItems}
            productCategories={parentProductCategories}
          />
        </div>
      </div>
    </nav>
  );
}
