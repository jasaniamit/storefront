"use server";

import { getAccessToken } from "@/lib/spree";

const API_URL = process.env.SPREE_API_URL;

interface JsonApiResource {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, { data?: { id: string; type: string } }>;
}

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${token}`,
  };
}

export interface WishlistStatus {
  wishlistToken: string;
  isSaved: boolean;
  wishedItemId: string | null;
}

/**
 * Looks up whether a given variant is already in the current user's
 * default wishlist. Returns null if the user isn't logged in — callers
 * should treat that as "prompt login" rather than "not saved".
 */
export async function getWishlistStatus(
  variantId: string,
): Promise<WishlistStatus | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const url = `${API_URL}/api/v2/storefront/wishlists/default?is_variant_included=${encodeURIComponent(
    variantId,
  )}&include=wished_items`;

  const res = await fetch(url, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const json = await res.json();
  const wishlist: JsonApiResource = json.data;
  const included: JsonApiResource[] = json.included ?? [];

  const wishedItem = included.find(
    (item) =>
      item.type === "wished_item" &&
      item.relationships?.variant?.data?.id === String(variantId),
  );

  return {
    wishlistToken: wishlist.attributes?.token as string,
    isSaved: Boolean(wishlist.attributes?.variant_included),
    wishedItemId: wishedItem?.id ?? null,
  };
}

/** Adds a variant to the given wishlist. */
export async function addToWishlist(
  wishlistToken: string,
  variantId: string,
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  const res = await fetch(
    `${API_URL}/api/v2/storefront/wishlists/${wishlistToken}/add_item`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ variant_id: variantId }),
    },
  );
  return res.ok;
}

/** Removes a wished item from the given wishlist. */
export async function removeFromWishlist(
  wishlistToken: string,
  wishedItemId: string,
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  const res = await fetch(
    `${API_URL}/api/v2/storefront/wishlists/${wishlistToken}/remove_item/${wishedItemId}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
  return res.ok;
}

export interface WishlistItem {
  wishedItemId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  displayPrice: string | null;
}

/**
 * Fetches the current user's default wishlist with full product/variant/
 * image details, for rendering the /account/wishlist page. Returns an
 * empty array if the user isn't logged in or the wishlist is empty.
 */
export async function listWishlistItems(): Promise<WishlistItem[]> {
  const token = await getAccessToken();
  if (!token) return [];

  const url =
    `${API_URL}/api/v2/storefront/wishlists/default` +
    `?include=wished_items.variant.images,wished_items.variant.product`;

  const res = await fetch(url, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) return [];

  const json = await res.json();
  const included: JsonApiResource[] = json.included ?? [];

  const byId = new Map(included.map((r) => [`${r.type}:${r.id}`, r]));

  const wishedItems = included.filter((r) => r.type === "wished_item");

  return wishedItems
    .map((item): WishlistItem | null => {
      const variantRef = item.relationships?.variant?.data;
      const variant = variantRef
        ? byId.get(`${variantRef.type}:${variantRef.id}`)
        : undefined;
      if (!variant) return null;

      const productRef = variant.relationships?.product?.data;
      const product = productRef
        ? byId.get(`${productRef.type}:${productRef.id}`)
        : undefined;

      const imagesRel = variant.relationships?.images as
        | { data?: { id: string; type: string }[] }
        | undefined;
      const firstImageRef = imagesRel?.data?.[0];
      const image = firstImageRef
        ? byId.get(`${firstImageRef.type}:${firstImageRef.id}`)
        : undefined;

      return {
        wishedItemId: item.id,
        variantId: variant.id,
        productName: (product?.attributes?.name as string) ?? "",
        productSlug: (product?.attributes?.slug as string) ?? "",
        imageUrl:
          (image?.attributes?.small_url as string) ??
          (image?.attributes?.product_url as string) ??
          null,
        displayPrice: (variant.attributes?.display_price as string) ?? null,
      };
    })
    .filter((item): item is WishlistItem => item !== null && !!item.productSlug);
}
