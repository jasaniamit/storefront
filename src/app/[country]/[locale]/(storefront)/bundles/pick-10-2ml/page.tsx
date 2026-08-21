import type { Metadata } from "next";
import { getCategories, getCategoryProducts } from "@/lib/data/categories";
import { BundleClient } from "./BundleClient";

export const metadata: Metadata = {
  title: "Pick Any 10 × 2ml Samples @ ₹410",
  description:
    "Choose any 10 fragrances from our 2ml sample collection for just ₹410. Save ₹90.",
};

interface PageProps {
  params: Promise<{ country: string; locale: string }>;
}

export default async function BundlePage({ params }: PageProps) {
  const { country, locale } = await params;
  const basePath = `/${country}/${locale}`;

  // 1. Find the 2ml-samples category ID
  const allCategories = await getCategories({
    depth_eq: 0,
    expand: ["children"],
  })
    .then((res) => res.data)
    .catch(() => []);

  const find2ml = (cats: typeof allCategories): string | null => {
    for (const cat of cats) {
      if (cat.permalink?.includes("2ml-samples")) return cat.id;
      if (cat.children) {
        for (const child of cat.children) {
          if (child.permalink?.includes("2ml-samples")) return child.id;
        }
      }
    }
    return null;
  };

  const categoryId = find2ml(allCategories);

  // 2. Fetch all products in 2ml-samples, expanding variants
  const allProducts = categoryId
    ? await getCategoryProducts(categoryId, {
        per_page: 100,
        expand: ["variants"],
      })
        .then((res) => res.data)
        .catch(() => [])
    : [];

  // 3. For each product, find the 2ml variant specifically
  //    Match by options_text containing "2ml" (case-insensitive)
  //    Use that variant's: price, id (for addItem), in_stock, purchasable
  const products = allProducts
    .map((product) => {
      const variants = Array.isArray(product.variants) ? product.variants : [];

      // Find 2ml variant — match options_text like "Size: 2ml" or "2 ml" or "2ML"
      const variant2ml = variants.find((v) => {
        const opts = (v.options_text ?? "").toLowerCase().replace(/\s/g, "");
        const sku = (v.sku ?? "").toLowerCase();
        return (
          opts.includes("2ml") ||
          opts.includes("size:2ml") ||
          sku.includes("2") && sku.endsWith("02") ||
          sku.endsWith("2ml")
        );
      });

      if (!variant2ml) {
        // No 2ml variant found on this product — skip it
        return null;
      }

      // Return product with 2ml-specific data overriding defaults
      return {
        ...product,
        // Use 2ml variant price (₹50) not product default price (may be ₹950)
        price: variant2ml.price ?? product.price,
        // Use 2ml variant ID so addItem() adds correct size to cart
        default_variant_id: variant2ml.id,
        // Use 2ml variant stock status for greying out OOS correctly
        in_stock: variant2ml.in_stock ?? product.in_stock,
        purchasable: variant2ml.purchasable ?? product.purchasable,
      };
    })
    .filter(Boolean) as typeof allProducts;

  return (
    <BundleClient
      products={products}
      basePath={basePath}
      bundleSize={10}
      bundlePrice={410}
      originalPrice={500}
      promoCode="BUNDLE2ML"
      shippingNote="+ ₹89 shipping (free above ₹999)"
    />
  );
}
