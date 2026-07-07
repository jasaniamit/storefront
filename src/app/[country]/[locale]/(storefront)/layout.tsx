import type { Category } from "@spree/sdk";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getCategories } from "@/lib/data/categories";

interface StorefrontLayoutProps {
  children: React.ReactNode;
  params: Promise<{ country: string; locale: string }>;
}

function CategoryLinks({
  categories,
  basePath,
}: {
  categories: Category[];
  basePath: string;
}) {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id}>
          <Link href={`${basePath}/c/${category.permalink}`}>
            {category.name}
          </Link>
          {category.children && category.children.length > 0 && (
            <CategoryLinks categories={category.children} basePath={basePath} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function StorefrontLayout({
  children,
  params,
}: StorefrontLayoutProps) {
  const { country, locale } = await params;
  const basePath = `/${country}/${locale}`;

  const rootCategories = await getCategories({
    depth_eq: 0,
    expand: ["children.children"],
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error("StorefrontLayout: failed to load categories", error);
      return [] as Category[];
    });

  // The "r" taxonomy holds internal tags (r/aqua-fresh, r/office, etc.)
  // used to power the Related Products carousel — it's not meant to be
  // browsable navigation, so it's excluded from the header/footer/nav
  // category list here. This has no effect on Related Products itself,
  // which fetches by category ID directly, not through this list.
  const navRootCategories = rootCategories.filter(
    (category) => category.name?.trim().toLowerCase() !== "r",
  );

  return (
    <>
      <AnnouncementBar />
      <Header
        rootCategories={navRootCategories}
        basePath={basePath}
        locale={locale as Locale}
      />
      {navRootCategories.length > 0 && (
        <nav aria-label="Category navigation" className="sr-only">
          <CategoryLinks categories={navRootCategories} basePath={basePath} />
        </nav>
      )}
      <main className="flex-1">{children}</main>
      <Footer
        rootCategories={navRootCategories}
        basePath={basePath}
        locale={locale as Locale}
      />
    </>
  );
}
