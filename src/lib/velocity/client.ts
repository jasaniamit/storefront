"use server";

// Server-side client for Velocity Shipping's Custom API
// (Velocity_Shipping_Custom_API_Documentation). Never import this from a
// client component — it holds the account's API key and talks directly to
// Velocity's base URL.
//
// STATUS (2026-09-19): switched from username/password token exchange to
// a static dashboard-generated API key, per Velocity's notice that
// POST /custom/api/v1/auth-token is being retired on 2026-09-30. Verified
// with a real request (AWB 7D140800901, key generated from Settings → API
// Keys on their dashboard) — confirmed the header format is unchanged
// (`Authorization: <key>`, no "Bearer " prefix, despite their email
// wording suggesting otherwise). This actually simplifies the client: no
// more per-request token exchange, no more username/password.
//
// Required env vars:
//   VELOCITY_API_BASE_URL   e.g. https://shazam.velocity.in (unchanged)
//   VELOCITY_API_KEY        generated from dashboard.velocity.in →
//                           Settings → API Keys (NOT the Webhooks page's
//                           API Key, which is a different secret used for
//                           the opposite direction — Velocity calling us).
//                           Expires per whatever you set on generation
//                           (max 365 days) — needs manual renewal before
//                           then, no auto-refresh possible.
//
// VELOCITY_USERNAME / VELOCITY_PASSWORD are no longer used and can be
// removed from the environment once this is deployed.

const BASE_URL = process.env.VELOCITY_API_BASE_URL;
const API_KEY = process.env.VELOCITY_API_KEY;

// Static courier ID → display name lookup. Velocity's carrier_id values
// are fixed/global (not per-account) — confirmed because CAR0EPDPJXXL4
// showed up as "DTDC Standard" in Velocity's own API documentation sample,
// and the exact same ID came back for a real shipment we tested. A
// hardcoded table is deliberately used here instead of an extra live call
// to their Serviceability API — one less external request that could fail
// on page load, for data that doesn't change. Sourced from the
// serviceability sample response in Velocity_Shipping_Custom_API_Documentation.
// Add new entries here if an AWB ever comes back with an unlisted id.
const COURIER_NAMES: Record<string, { name: string; brand: string }> = {
  CAR0EPDPJXXL4: { name: "DTDC Standard", brand: "DTDC" },
  CARCVBWTPRH08: { name: "Ekart Standard", brand: "Ekart" },
  CAR5IXXJVT5MD: { name: "Delhivery Standard 5 Kg", brand: "Delhivery" },
  CARVKGNGNLOCU: { name: "Blitz Special", brand: "Blitz" },
  CARFYXUKCQHBM: { name: "Delhivery Special Standard 20 kg", brand: "Delhivery" },
  CARVPHPLJQJOA: { name: "Delhivery Special Standard 10 kg", brand: "Delhivery" },
  CARO0ZZQH1H6U: { name: "Delhivery Standard", brand: "Delhivery" },
  CAR2FZNOLGJ2X: { name: "Bluedart Standard", brand: "BlueDart" },
  CARLTTKCUYWRM: { name: "Delhivery Standard 250G", brand: "Delhivery" },
  CARTS5SW8LSJT: { name: "XpressBees Standard", brand: "XpressBees" },
  CARKX7WW6UNS8: { name: "Pikndel NDD", brand: "Pikndel" },
};

// Logo file per courier BRAND (not per courier_id) — several courier_ids
// above share the same brand (e.g. the 4 Delhivery weight variants all use
// one Delhivery logo). Files live in /public/couriers/ — add a new entry
// here whenever a new logo file gets added to that folder. A brand with no
// entry here just renders as a plain text badge instead, no code change
// needed for that fallback.
const COURIER_LOGOS: Record<string, string> = {
  DTDC: "/couriers/dtdc.svg",
  Delhivery: "/couriers/delhivery.svg",
  BlueDart: "/couriers/bluedart.png",
};



export interface VelocityTrackActivity {
  date: string;
  activity: string;
  location: string;
}

export interface VelocityTrackResult {
  found: boolean;
  shipment_status: string | null;
  current_status: string | null;
  origin: string | null;
  destination: string | null;
  consignee_name: string | null;
  pickup_date: string | null;
  delivered_date: string | null;
  estimated_delivery_date: string | null;
  original_edd: string | null;
  is_delayed: boolean;
  courier_brand: string | null;
  courier_logo: string | null;
  activities: VelocityTrackActivity[];
  track_url: string | null;
}

const NOT_FOUND_RESULT: VelocityTrackResult = {
  found: false,
  shipment_status: null,
  current_status: null,
  origin: null,
  destination: null,
  consignee_name: null,
  pickup_date: null,
  delivered_date: null,
  estimated_delivery_date: null,
  original_edd: null,
  is_delayed: false,
  courier_brand: null,
  courier_logo: null,
  activities: [],
  track_url: null,
};

/**
 * Fetches live tracking status for a single AWB from Velocity's
 * order-tracking API. Returns a "not found" result rather than throwing
 * when Velocity simply has no record of the AWB, so the tracking page can
 * show a friendly message instead of an error screen.
 */
export async function trackAwb(awb: string): Promise<VelocityTrackResult> {
  if (!BASE_URL || !API_KEY) {
    throw new Error("Velocity API is not configured (missing VELOCITY_API_BASE_URL / VELOCITY_API_KEY)");
  }

  const res = await fetch(`${BASE_URL}/custom/api/v1/order-tracking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_KEY,
    },
    body: JSON.stringify({ awbs: [awb] }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`[velocity] order-tracking failed: ${res.status} ${res.statusText}`);
    throw new Error("Failed to fetch tracking status from Velocity");
  }

  const json = await res.json();
  const entry = json?.result?.[awb]?.tracking_data;

  if (!entry) return NOT_FOUND_RESULT;

  const latestTrack = entry.shipment_track?.[0];
  const courierId: string | undefined = latestTrack?.courier_company_id;
  const courierBrand = courierId ? COURIER_NAMES[courierId]?.brand ?? null : null;
  const courierLogo = courierBrand ? COURIER_LOGOS[courierBrand] ?? null : null;

  // Velocity's own public tracking page treats `original_edd` (the date
  // committed at booking) as THE headline "Expected Delivery Date", and
  // flags "DELAYED" using TWO different triggers — confirmed against two
  // real shipments:
  //   1. Velocity recalculated a later forecast than the original promise
  //      (AWB 7D140800901: original_edd Sep 26, estimated_delivery_date
  //      pushed to Oct 6 — no recalculation needed to notice this one).
  //   2. The original promise date has simply already passed and the
  //      shipment still isn't delivered — even when Velocity never
  //      recalculated a separate date at all (AWB 7D140700754:
  //      estimated_delivery_date and original_edd were IDENTICAL at
  //      Sep 19, today is Sep 20, shipment still in_transit with a
  //      "VEHICLE BREAKDOWN" event in its history — Velocity's page still
  //      showed DELAYED because the promise date itself had lapsed).
  // Checking only #1 misses every case like #2, which is exactly the bug
  // this replaces.
  const originalEdd: string | null = entry.original_edd ?? null;
  const recalculatedEdd: string | null = entry.estimated_delivery_date ?? null;
  const isDelivered = (entry.shipment_status ?? "").toLowerCase() === "delivered" || !!latestTrack?.delivered_date;
  const recalculatedIsLater =
    !!originalEdd && !!recalculatedEdd && new Date(recalculatedEdd).getTime() > new Date(originalEdd).getTime();
  const originalDatePassed = !!originalEdd && new Date(originalEdd).getTime() < Date.now();
  const isDelayed = !isDelivered && (recalculatedIsLater || originalDatePassed);

  return {
    found: true,
    shipment_status: entry.shipment_status ?? null,
    current_status: latestTrack?.current_status ?? null,
    origin: latestTrack?.origin ?? null,
    destination: latestTrack?.destination ?? entry.destination ?? null,
    consignee_name: latestTrack?.consignee_name ?? null,
    pickup_date: latestTrack?.pickup_date ?? null,
    delivered_date: latestTrack?.delivered_date ?? null,
    // Primary headline date shown to customers — the original commitment,
    // matching Velocity's own page. Falls back to the recalculated date
    // only if no original commitment was ever set (rare/early shipments).
    estimated_delivery_date: originalEdd ?? recalculatedEdd,
    original_edd: originalEdd,
    is_delayed: isDelayed,
    courier_brand: courierBrand,
    courier_logo: courierLogo,
    activities: (entry.shipment_track_activities ?? []) as VelocityTrackActivity[],
    track_url: entry.track_url ?? null,
  };
}
