import type { Product } from "@spree/sdk";
import { ProductGrid } from "@/components/products/ProductGrid";

interface RelatedProductsProps {
  products: Product[];
  basePath: string;
}

export function RelatedProducts({ products, basePath }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-10">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        You may also like
      </h2>
      <ProductGrid
        products={products.slice(0, 4)}
        basePath={basePath}
        listId="related_products"
        listName="Related Products"
      />
    </div>
  );
}
