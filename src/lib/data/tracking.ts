const API_URL = process.env.SPREE_API_URL;
const PUBLISHABLE_KEY = process.env.SPREE_PUBLISHABLE_KEY;

function headers(): HeadersInit {
  return { "X-Spree-API-Key": PUBLISHABLE_KEY ?? "" };
}

export interface OrderTrackingInfo {
  order_number: string;
  order_state: string;
  shipped: boolean;
  awb_code: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
}

/**
 * Looks up an order's shipment/AWB status directly from Spree
 * (GET /api/v3/store/tracking/:order_number — see
 * spree-starter's TrackingController). Returns null if the order
 * doesn't exist; never throws for a plain "not found" case, only for
 * genuine network/server failures, so callers can safely fall back to
 * treating the input as a raw AWB instead.
 */
export async function getOrderTracking(
  orderNumber: string,
): Promise<OrderTrackingInfo | null> {
  const res = await fetch(
    `${API_URL}/api/v3/store/tracking/${encodeURIComponent(orderNumber)}`,
    {
      headers: headers(),
      cache: "no-store", // tracking status is time-sensitive, never cache
    },
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    console.error(
      `[tracking] getOrderTracking failed: ${res.status} ${res.statusText}`,
    );
    throw new Error("Failed to fetch order tracking");
  }

  const json = await res.json();
  return json.data as OrderTrackingInfo;
}
