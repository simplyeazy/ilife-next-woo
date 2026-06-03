// CUSTOM: redesigned nav to match iLife branding
import Link from "next/link";
import { MobileNav } from "@/components/nav/mobile-nav";
import { CartDrawer } from "@/components/shop";
import { cn } from "@/lib/utils";
import { ILifeLogo } from "@/components/custom/ilife-logo";
import { NavLinks } from "@/components/layout/nav-links";
import { getLogo } from "@/lib/custom/logo";
import { featureFlags } from "@/site.config";

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export async function Nav({ className, children, id }: NavProps) {
  const logo = await getLogo();

  return (
    <nav
      className={cn(
        "sticky z-50 top-0 bg-white border-b border-gray-200 shadow-sm",
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
          <NavLinks />
          {featureFlags.ENABLE_CART && <CartDrawer />}
          <MobileNav logoSrc={logo?.src} logoAlt={logo?.alt} />
        </div>
      </div>
    </nav>
  );
}
