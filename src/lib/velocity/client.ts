"use server";

// Server-side client for Velocity Shipping's Custom API
// (Velocity_Shipping_Custom_API_Documentation). Never import this from a
// client component — it holds the account username/password and talks
// directly to Velocity's base URL.
//
// STATUS (2026-09-15): API access confirmed enabled and working — verified
// against a real CSV-uploaded shipment (AWB 7D140289950), which returned
// full tracking data. Both earlier open questions are resolved: API access
// just needed to be turned on by Velocity support, and CSV-uploaded
// shipments ARE covered by this endpoint. The tracking page's fallback to
// Velocity's public embed (see app/api/tracking/search/route.ts) is now a
// pure safety net for transient failures, not the primary path.
//
// Required env vars:
//   VELOCITY_API_BASE_URL   e.g. https://shazam.velocity.in
//   VELOCITY_USERNAME       mobile number with country code, e.g. +91xxxxxxxxxx
//   VELOCITY_PASSWORD       Velocity Shipping account password
//
// Token handling: Velocity's token is valid for 24h, but this app runs on
// stateless serverless functions — rather than sharing a cached token
// across invocations (which adds a failure mode if it ever goes stale
// unexpectedly), we simply fetch a fresh token on every tracking request.
// This is one extra cheap API call per search, traded for zero chance of
// a stuck/expired-token bug on a live site.

const BASE_URL = process.env.VELOCITY_API_BASE_URL;
const USERNAME = process.env.VELOCITY_USERNAME;
const PASSWORD = process.env.VELOCITY_PASSWORD;

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

interface VelocityAuthResponse {
  token: string;
  expires_at: string;
}

async function getVelocityToken(): Promise<string> {
  if (!BASE_URL || !USERNAME || !PASSWORD) {
    throw new Error(
      "Velocity API is not configured (missing VELOCITY_API_BASE_URL / VELOCITY_USERNAME / VELOCITY_PASSWORD)",
    );
  }

  const res = await fetch(`${BASE_URL}/custom/api/v1/auth-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Velocity auth failed: ${res.status} ${res.statusText}`);
  }

  const data: VelocityAuthResponse = await res.json();
  return data.token;
}

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
  const token = await getVelocityToken();

  const res = await fetch(`${BASE_URL}/custom/api/v1/order-tracking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
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
  // flags "DELAYED" when the live recalculated forecast
  // (`estimated_delivery_date`) has slipped past it. We match that
  // behavior instead of showing the recalculated date as if it were a
  // normal, on-track estimate — confirmed against a real delayed shipment
  // (AWB 7D140800901: original_edd Sep 26, estimated_delivery_date pushed
  // to Oct 6, Velocity's page showed Sep 26 + DELAYED).
  const originalEdd: string | null = entry.original_edd ?? null;
  const recalculatedEdd: string | null = entry.estimated_delivery_date ?? null;
  const isDelayed =
    !!originalEdd && !!recalculatedEdd && new Date(recalculatedEdd).getTime() > new Date(originalEdd).getTime();

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
