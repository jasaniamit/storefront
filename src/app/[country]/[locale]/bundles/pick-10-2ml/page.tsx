import type { Metadata } from "next";
import { getCategory, getCategoryProducts } from "@/lib/data/categories";
import { BundleClient } from "./BundleClient";

export const metadata: Metadata = {
  title: "Pick Any 10 × 2ml Samples @ ₹410",
  description:
    "Choose any 10 fragrances from our 2ml sample collection for just ₹410. Save ₹90 on your discovery bundle.",
};

interface PageProps {
  params: Promise<{ country: string; locale: string }>;
}

export default async function BundlePage({ params }: PageProps) {
  const { country, locale } = await params;
  const basePath = `/${country}/${locale}`;

  // Fetch the 2ml-samples category to get its ID
  const category = await getCategory("2ml-samples").catch(() => null);

  // Fetch products belonging to that category
  const result = category
    ? await getCategoryProducts(category.id, {
        per_page: 100,
      }).catch(() => null)
    : null;

  const products = result?.data ?? [];

  return (
    <BundleClient
      products={products}
      basePath={basePath}
      bundleSize={10}
      bundlePrice={410}
      originalPrice={500}
      promoCode="BUNDLE2ML"
      shippingNote="+ ₹79 shipping (free above ₹999)"
    />
  );
}
