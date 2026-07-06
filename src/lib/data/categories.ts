"use server";

import type {
  Category,
  CategoryListParams,
  Product,
  ProductListParams,
} from "@spree/sdk";
import { cacheLife, cacheTag } from "next/cache";
import { getAccessToken, getClient, getLocaleOptions } from "@/lib/spree";
import { isScentFamilyCategory } from "@/lib/data/scent-families";

async function cachedListCategories(
  params: CategoryListParams | undefined,
  options: { locale?: string; country?: string },
) {
  "use cache: remote";
  cacheLife("hours");
  cacheTag("categories");
  return getClient().categories.list(params, options);
}

export async function getCategories(params?: CategoryListParams) {
  const options = await getLocaleOptions();
  return cachedListCategories(params, options);
}

async function cachedGetCategory(
  idOrPermalink: string,
  params: { expand?: string[] } | undefined,
  options: { locale?: string; country?: string },
) {
  "use cache: remote";
  cacheLife("tenMinutes");
  cacheTag("category");
  return getClient().categories.get(idOrPermalink, params, options);
}

export async function getCategory(
  idOrPermalink: string,
  params?: { expand?: string[] },
) {
  const options = await getLocaleOptions();
  return cachedGetCategory(idOrPermalink, params, options);
}

/**
 * Persistent cached category products fetch. Cache key is derived from
 * all function arguments (categoryId, params, locale, country, userToken).
 * Guest users pass undefined so the cache entry is shared.
 */
async function cachedListCategoryProducts(
  categoryId: string,
  params: ProductListParams | undefined,
  options: { locale?: string; country?: string },
  _userToken?: string,
) {
  "use cache: remote";
  cacheLife("tenMinutes");
  cacheTag("products", `category-products:${categoryId}`);
  return getClient().products.list(
    { ...params, in_category: categoryId },
    options,
  );
}

export async function getRelatedProducts(product: {
  id: string;
  categories?: Category[];
}) {
  const relatedCategories = (product.categories || []).filter((c) =>
    isScentFamilyCategory(c.permalink),
  );
  if (relatedCategories.length === 0) return [];

  const results = await Promise.all(
    relatedCategories.map((c) =>
      getCategoryProducts(c.id, { per_page: 12 }),
    ),
  );

  const seen = new Set<string>([product.id]);
  const merged: Product[] = [];
  for (const { data } of results) {
    for (const p of data) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        merged.push(p);
      }
    }
  }
  return merged.slice(0, 12);
}

export async function getCategoryProducts(
  categoryId: string,
  params?: ProductListParams,
) {
  const options = await getLocaleOptions();
  const userToken = await getAccessToken();
  return cachedListCategoryProducts(categoryId, params, options, userToken);
}
