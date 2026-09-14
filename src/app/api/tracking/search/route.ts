import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getOrderTracking } from "@/lib/data/tracking";

/**
 * Public tracking search — accepts EITHER an order number (e.g. R043155873)
 * or a raw AWB code in a single input, no verification step (by design:
 * both are only ever known to someone who received the confirmation/
 * shipping email).
 *
 * IMPORTANT: this deliberately does NOT call Velocity's authenticated
 * Custom API (order-tracking endpoint) for live status anymore. That API
 * is meant for shipments created through Velocity's Custom Integration
 * API — orders manifested via the bulk CSV upload (which is how this
 * store actually ships) don't reliably show up through it, and it adds a
 * whole extra failure surface (credentials, token refresh, endpoint
 * scope) for something Velocity already solves better on their own:
 *
 *   https://www.velocityshipping.in/track/<AWB>
 *
 * is Velocity's own public tracking page, requires no auth, and already
 * works correctly for any AWB regardless of how the shipment was created.
 * We embed that directly in the tracking page instead of re-implementing
 * a live-status UI ourselves — fewer moving parts, more reliable.
 *
 * Strategy:
 *   1. Try the input as an Order Id first (fast local DB lookup via Spree).
 *      - Order found + has an AWB   -> return the AWB so the page can
 *        embed Velocity's public tracker for it.
 *      - Order found, not shipped  -> return Spree's own status, no AWB
 *        to embed yet.
 *   2. Order not found             -> assume the input IS a raw AWB and
 *      hand it straight back for the page to embed directly. (If it's not
 *      a real AWB, Velocity's own tracker page shows its own not-found
 *      state — no need to duplicate that validation here.)
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query.trim() : "";

  if (!query) {
    return NextResponse.json({ error: "Enter an Order Id or AWB number" }, { status: 400 });
  }

  try {
    const order = await getOrderTracking(query);

    if (order) {
      return NextResponse.json({
        type: "order",
        order,
        awb: order.shipped ? order.awb_code : null,
      });
    }

    // No matching order in Spree — treat the input directly as an AWB.
    return NextResponse.json({ type: "awb", order: null, awb: query });
  } catch (error) {
    console.error("[tracking-search] Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong while looking up tracking. Please try again shortly." },
      { status: 502 },
    );
  }
}
