import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getOrderTracking } from "@/lib/data/tracking";
import { trackAwb } from "@/lib/velocity/client";

/**
 * Public tracking search — accepts EITHER an order number (e.g. R043155873)
 * or a raw AWB code in a single input, no verification step (by design:
 * both are only ever known to someone who received the confirmation/
 * shipping email).
 *
 * Data source: Velocity's authenticated order-tracking API (see
 * lib/velocity/client.ts) is the primary source — it returns real
 * structured data (status, timeline, expected delivery) that the page
 * renders natively, matching the site's own design.
 *
 * As of 2026-09-15, this API returns API_ACCESS_DISABLED for this
 * account — Velocity support needs to enable API access first. Once
 * enabled, it's still an open question whether shipments created via the
 * bulk CSV upload (rather than their Custom Integration API) are covered.
 * To avoid another redesign/redeploy cycle either way, this route
 * degrades gracefully: if trackAwb() ever returns "not found" for a
 * specific AWB (including right now, while access is disabled), the page
 * falls back to embedding Velocity's own public tracker
 * (velocityshipping.in/track/<AWB>), which is confirmed working for any
 * AWB regardless of how it was created.
 *
 * Strategy:
 *   1. Try the input as an Order Id first (fast local DB lookup via Spree).
 *      - Order found, not shipped  -> return Spree's own status, nothing
 *        to track yet.
 *      - Order found + shipped     -> use its stored AWB below.
 *   2. Order not found             -> assume the input IS a raw AWB.
 *   3. Whichever AWB we end up with, try Velocity's API for real data.
 *      If that fails/returns nothing, fall back to the embed URL.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query.trim() : "";

  if (!query) {
    return NextResponse.json({ error: "Enter an Order Id or AWB number" }, { status: 400 });
  }

  try {
    const order = await getOrderTracking(query);
    const awb = order ? (order.shipped ? order.awb_code : null) : query;

    if (order && !order.shipped) {
      return NextResponse.json({ order, awb: null, live: null });
    }

    if (!awb) {
      return NextResponse.json({ order, awb: null, live: null });
    }

    const live = await trackAwb(awb).catch((err) => {
      console.error("[tracking-search] Velocity API call failed:", err);
      return null;
    });

    return NextResponse.json({
      order,
      awb,
      live: live?.found ? live : null,
    });
  } catch (error) {
    console.error("[tracking-search] Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong while looking up tracking. Please try again shortly." },
      { status: 502 },
    );
  }
}
