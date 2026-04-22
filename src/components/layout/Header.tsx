import type { Category } from "@spree/sdk";
import { User } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CartButton } from "@/components/layout/CartButton";
import { SearchToggle } from "@/components/layout/SearchToggle";
import { Button } from "@/components/ui/button";
import { getStoreName } from "@/lib/store";

const LazyMobileMenu = dynamic(
  () =>
    import("@/components/layout/MobileMenu").then((mod) => ({
      default: mod.MobileMenu,
    })),
);

const LazyCountrySwitcher = dynamic(
  () =>
    import("@/components/layout/CountrySwitcher").then((mod) => ({
      default: mod.CountrySwitcher,
    })),
);

const storeName = getStoreName();

const NAV_LINKS = [
  { label: "10ML", href: "/c/10ml" },
  { label: "2ML SAMPLES", href: "/c/2ml-samples" },
  { label: "NEW ARRIVALS", href: "/c/new-arrivals" },
  { label: "BLOG", href: "/blog" },
  { label: "SHOP ALL", href: "/products" },
];

interface HeaderProps {
  rootCategories: Category[];
  basePath: string;
  locale: Locale;
}

export async function Header({ rootCategories, basePath, locale }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: "header" });

  return (
    <div className="sticky top-0 z-50 bg-white">

      {/* TOP HEADER */}
      <div>
        <SearchToggle
          basePath={basePath}
          left={
            <LazyMobileMenu rootCategories={rootCategories} basePath={basePath} />
          }
          center={
            <div className="flex flex-col items-center justify-center py-[15px]">

              {/* LOGO */}
              <Link href={basePath || "/"}>
                <Image
                  src="/noz.svg"
                  alt={storeName}
                  width={120}
                  height={41}
                  priority
                  style={{
                    height: "41px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </Link>

            </div>
          }
          rightStart={
            <div className="hidden lg:block">
              <LazyCountrySwitcher />
            </div>
          }
          rightEnd={
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <Button variant="ghost" size="icon-lg" asChild>
                  <Link href={`${basePath}/account`} aria-label={t("account")}>
                    <User className="size-5" />
                  </Link>
                </Button>
              </div>
              <CartButton />
            </div>
          }
        />
      </div>

      {/* NAVIGATION (LIKE NOZ EXACT) */}
      <nav className="hidden lg:flex justify-center border-b border-gray-200">
        <div className="flex items-center gap-6 h-[48px]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={`${basePath}${link.href}`}
              className="text-[14px] tracking-widest uppercase text-[#1a1a1a] hover:text-[#e86c5f] transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

    </div>
  );
}
