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
 * Strategy:
 *   1. Try it as an Order Id first (fast, local DB lookup via Spree).
 *      - Order found + has an AWB  -> also fetch live status from Velocity.
 *      - Order found, not shipped  -> return Spree's own status, no
 *        Velocity call needed.
 *   2. Order not found            -> assume the input is a raw AWB and ask
 *      Velocity directly.
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
      if (!order.shipped || !order.awb_code) {
        return NextResponse.json({
          type: "order",
          order,
          live: null,
        });
      }

      const live = await trackAwb(order.awb_code).catch((err) => {
        console.error("[tracking-search] Velocity lookup failed for order", query, err);
        return null; // Spree's own status still gets returned below
      });

      return NextResponse.json({ type: "order", order, live });
    }

    // No matching order — try the input directly as an AWB.
    const live = await trackAwb(query);

    if (!live.found) {
      return NextResponse.json(
        { error: "No order or AWB found matching that number" },
        { status: 404 },
      );
    }

    return NextResponse.json({ type: "awb", order: null, live });
  } catch (error) {
    console.error("[tracking-search] Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong while looking up tracking. Please try again shortly." },
      { status: 502 },
    );
  }
}
