"use server";

import { getAccessToken } from "@/lib/spree";

const API_URL = process.env.SPREE_API_URL;

interface JsonApiResource {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, { data?: { id: string; type: string } | { id: string; type: string }[] }>;
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
 * Finds the user's default wishlist (creating one if they don't have one
 * yet) and reports whether the given variant is already saved in it.
 *
 * NOTE: Spree has no "/wishlists/default" endpoint — you have to list the
 * user's wishlists and find the one flagged `is_default: true` yourself.
 */
export async function getWishlistStatus(
  variantId: string,
): Promise<WishlistStatus | null> {
  const token = await getAccessToken();
  if (!token) {
    console.error("[wishlist] getWishlistStatus: no access token found");
    return null;
  }

  const listUrl =
    `${API_URL}/api/v2/storefront/wishlists` +
    `?is_variant_included=${encodeURIComponent(variantId)}&include=wished_items`;

  const res = await fetch(listUrl, {
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(
      `[wishlist] list wishlists failed: ${res.status} ${res.statusText}`,
      { url: listUrl, body },
    );
    return null;
  }

  const json = await res.json();
  const wishlists: JsonApiResource[] = json.data ?? [];
  const included: JsonApiResource[] = json.included ?? [];

  let defaultWishlist = wishlists.find((w) => w.attributes?.is_default);

  // No default wishlist yet (e.g. brand new customer) — create one.
  if (!defaultWishlist) {
    const createRes = await fetch(`${API_URL}/api/v2/storefront/wishlists`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        wishlist: { name: "My Wishlist", is_default: true },
      }),
    });

    if (!createRes.ok) {
      const body = await createRes.text().catch(() => "");
      console.error(
        `[wishlist] create default wishlist failed: ${createRes.status} ${createRes.statusText}`,
        { body },
      );
      return null;
    }

    const createJson = await createRes.json();
    defaultWishlist = createJson.data;
    return {
      wishlistToken: defaultWishlist!.attributes?.token as string,
      isSaved: false,
      wishedItemId: null,
    };
  }

  const wishedItem = included.find(
    (item) =>
      item.type === "wished_item" &&
      !Array.isArray(item.relationships?.variant?.data) &&
      (item.relationships?.variant?.data as { id: string })?.id ===
        String(variantId),
  );

  return {
    wishlistToken: defaultWishlist.attributes?.token as string,
    isSaved: Boolean(defaultWishlist.attributes?.variant_included),
    wishedItemId: wishedItem?.id ?? null,
  };
}

/** Adds a variant to the given wishlist. */
export async function addToWishlist(
  wishlistToken: string,
  variantId: string,
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) {
    console.error("[wishlist] addToWishlist: no access token found");
    return false;
  }

  const res = await fetch(
    `${API_URL}/api/v2/storefront/wishlists/${wishlistToken}/add_item`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ variant_id: variantId }),
    },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(
      `[wishlist] addToWishlist failed: ${res.status} ${res.statusText}`,
      { wishlistToken, variantId, body },
    );
  }
  return res.ok;
}

/** Removes a wished item from the given wishlist. */
export async function removeFromWishlist(
  wishlistToken: string,
  wishedItemId: string,
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) {
    console.error("[wishlist] removeFromWishlist: no access token found");
    return false;
  }

  const res = await fetch(
    `${API_URL}/api/v2/storefront/wishlists/${wishlistToken}/remove_item/${wishedItemId}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(
      `[wishlist] removeFromWishlist failed: ${res.status} ${res.statusText}`,
      { wishlistToken, wishedItemId, body },
    );
  }
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

  const listUrl =
    `${API_URL}/api/v2/storefront/wishlists` +
    `?include=wished_items.variant.images,wished_items.variant.product`;

  const res = await fetch(listUrl, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(
      `[wishlist] listWishlistItems failed: ${res.status} ${res.statusText}`,
      { body },
    );
    return [];
  }

  const json = await res.json();
  const wishlists: JsonApiResource[] = json.data ?? [];
  const included: JsonApiResource[] = json.included ?? [];

  const defaultWishlist = wishlists.find((w) => w.attributes?.is_default);
  if (!defaultWishlist) return [];

  const defaultWishedItemRefs = defaultWishlist.relationships?.wished_items
    ?.data as { id: string; type: string }[] | undefined;
  const defaultWishedItemIds = new Set(
    (defaultWishedItemRefs ?? []).map((r) => r.id),
  );

  const byId = new Map(included.map((r) => [`${r.type}:${r.id}`, r]));
  const wishedItems = included.filter(
    (r) => r.type === "wished_item" && defaultWishedItemIds.has(r.id),
  );

  return wishedItems
    .map((item): WishlistItem | null => {
      const variantRef = item.relationships?.variant?.data as
        | { id: string; type: string }
        | undefined;
      const variant = variantRef
        ? byId.get(`${variantRef.type}:${variantRef.id}`)
        : undefined;
      if (!variant) return null;

      const productRef = variant.relationships?.product?.data as
        | { id: string; type: string }
        | undefined;
      const product = productRef
        ? byId.get(`${productRef.type}:${productRef.id}`)
        : undefined;

      const imagesRel = variant.relationships?.images?.data as
        | { id: string; type: string }[]
        | undefined;
      const firstImageRef = imagesRel?.[0];
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
    .filter(
      (item): item is WishlistItem => item !== null && !!item.productSlug,
    );
}
