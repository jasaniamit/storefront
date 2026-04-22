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
  {
    loading: () => (
      <div className="inline-flex items-center justify-center h-10 w-10" />
    ),
  },
);

const LazyCountrySwitcher = dynamic(
  () =>
    import("@/components/layout/CountrySwitcher").then((mod) => ({
      default: mod.CountrySwitcher,
    })),
  {
    loading: () => (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  },
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

      <div className="[&>header]:static [&>header]:border-b-0 [&>header]:z-auto">
        <SearchToggle
          basePath={basePath}
          left={
            <LazyMobileMenu rootCategories={rootCategories} basePath={basePath} />
          }
          center={
            <div className="flex items-center justify-center h-[64px]">
              <Link href={basePath || "/"}>
                <Image
                  src="/noz.svg"
                  alt={storeName}
                  width={106}
                  height={41}
                  priority
                  style={{
                    width: "106px",
                    height: "41px",
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
            <>
              <div className="hidden md:block">
                <Button variant="ghost" size="icon-lg" asChild>
                  <Link href={`${basePath}/account`} aria-label={t("account")}>
                    <User className="size-5" />
                  </Link>
                </Button>
              </div>
              <CartButton />
            </>
          }
        />
      </div>

      <nav
        aria-label="Main navigation"
        className="hidden lg:flex items-center justify-center gap-8 border-b border-gray-200"
        style={{ height: "48px" }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={`${basePath}${link.href}`}
            style={{
              fontSize: "14px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              color: "#1a1a1a",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
            className="hover:text-[#e86c5f]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
