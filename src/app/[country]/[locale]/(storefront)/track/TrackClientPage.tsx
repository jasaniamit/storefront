// src/app/[country]/[locale]/(storefront)/track/TrackClientPage.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Package, Search, AlertCircle, Check, Truck, Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const VELOCITY_TRACK_BASE_URL = "https://www.velocityshipping.in/track";

interface OrderTrackingInfo {
  order_number: string;
  order_state: string;
  shipped: boolean;
  awb_code: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
}

interface VelocityTrackActivity {
  date: string;
  activity: string;
  location: string;
}

interface VelocityTrackResult {
  found: boolean;
  shipment_status: string | null;
  current_status: string | null;
  origin: string | null;
  destination: string | null;
  pickup_date: string | null;
  delivered_date: string | null;
  estimated_delivery_date: string | null;
  courier_brand: string | null;
  courier_logo: string | null;
  activities: VelocityTrackActivity[];
  track_url: string | null;
}

interface SearchResponse {
  order: OrderTrackingInfo | null;
  awb: string | null;
  live: VelocityTrackResult | null;
}

type Status = "idle" | "loading" | "success" | "error";

export default function TrackClientPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<SearchResponse | null>(null);
  const autoSearchedRef = useRef(false);

  async function runSearch(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMessage("");
    setResult(null);

    try {
      const res = await fetch("/api/tracking/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "We couldn't find that Order Id or AWB number.");
        return;
      }

      setResult(data);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again in a moment.");
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  // Deep-link support — a tracking link from an order email or the Spree
  // order page can point straight here as
  // /track?awb=<tracking-number> (or ?order=<order-number>) and the search
  // runs automatically, no typing or clicking needed. Mirrors DTDC's
  // ?awb= deep-link pattern, minus the captcha since this isn't a public
  // multi-tenant tracking site.
  useEffect(() => {
    if (autoSearchedRef.current) return;
    const fromUrl = searchParams.get("awb") || searchParams.get("order") || searchParams.get("q");
    if (fromUrl) {
      autoSearchedRef.current = true;
      setQuery(fromUrl);
      runSearch(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <div className="mb-10 text-center">
        <Package className="mx-auto mb-3 h-9 w-9 text-[#e86c5f]" />
        <h1 className="text-2xl font-semibold md:text-3xl">Track Your Order</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your Order Id or AWB number from your confirmation email.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-10 flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. R043155873 or an AWB number"
          className="h-12 text-base"
          autoFocus
        />
        <Button type="submit" size="lg" disabled={status === "loading"}>
          <Search className="mr-1 h-4 w-4" />
          {status === "loading" ? "Searching…" : "Track"}
        </Button>
      </form>

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not found</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {status === "success" && result && <TrackingResult data={result} />}
    </div>
  );
}

function TrackingResult({ data }: { data: SearchResponse }) {
  const { order, awb, live } = data;

  // Order found in Spree, but not shipped yet — nothing to track.
  if (order && !order.shipped) {
    return (
      <div className="border-t pt-6 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Order {order.order_number}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This order is <span className="font-medium text-foreground">{formatState(order.order_state)}</span> and
          hasn&apos;t shipped yet. Once it ships, tracking details will appear here automatically.
        </p>
      </div>
    );
  }

  // Order shipped but no AWB recorded yet (webhook hasn't caught up).
  if (order && order.shipped && !awb) {
    return (
      <div className="border-t pt-6 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Order {order.order_number}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This order has shipped and tracking details are being updated — please check back shortly.
        </p>
      </div>
    );
  }

  if (!awb) return null;

  // Real structured data from Velocity's API — render natively in the
  // site's own design.
  if (live?.found) {
    return <NativeTracking order={order} awb={awb} live={live} />;
  }

  // Velocity's authenticated API had nothing for this AWB (currently the
  // case for every AWB, since API access is disabled for the account —
  // see lib/velocity/client.ts). Fall back to their public tracker,
  // embedded full-width and borderless so it sits as close to "native" as
  // an embedded page can.
  const trackUrl = `${VELOCITY_TRACK_BASE_URL}/${encodeURIComponent(awb)}`;
  return (
    <div className="border-t pt-6">
      {order && (
        <p className="mb-4 text-center text-sm uppercase tracking-widest text-muted-foreground">
          Order {order.order_number}
        </p>
      )}
      <iframe src={trackUrl} title="Shipment tracking" className="h-[560px] w-full border-0" />
    </div>
  );
}

// The 4 major milestones shown in the step tracker. Granular activity
// (pickup rescheduled, shipment booked, etc.) still shows in the
// timeline below — this row only reflects the big picture, same idea as
// DTDC's "Picked Up / In Transit / Out for Delivery / Delivered" bar.
const STEPS = [
  { key: "picked_up", label: "Picked up", icon: Check },
  { key: "in_transit", label: "In transit", icon: Truck },
  { key: "out_for_delivery", label: "Out for delivery", icon: Package },
  { key: "delivered", label: "Delivered", icon: Home },
];

// Checked most-specific-first so e.g. "delivered" doesn't get matched by
// a looser "deliver" substring meant for "out_for_delivery".
function getStepIndex(rawStatus: string): number {
  const s = rawStatus.trim().toLowerCase().replace(/\s+/g, "_");
  if (s.includes("delivered")) return 3;
  if (s.includes("out_for_delivery") || s.includes("out for delivery")) return 2;
  if (s.includes("in_transit") || s.includes("transit")) return 1;
  if (s.includes("picked_up") || s.includes("picked up") || s.includes("shipment_booked")) return 0;
  return -1; // pickup requested/scheduled/rescheduled/awaited, not picked, etc.
}

function StepTracker({ status }: { status: string }) {
  const currentIndex = getStepIndex(status);

  return (
    <div className="mb-2 mt-8 flex items-start">
      {STEPS.map((step, i) => {
        const reached = i <= currentIndex;
        const nextReached = i < currentIndex; // segment AFTER this node only fills once we've moved past it
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex-1 text-center">
            <div className="flex items-center">
              <div className={`h-0.5 flex-1 ${i === 0 ? "invisible" : reached ? "bg-[#e86c5f]" : "bg-border"}`} />
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  reached ? "bg-[#e86c5f] text-white" : "border-[1.5px] border-border text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "invisible" : nextReached ? "bg-[#e86c5f]" : "bg-border"}`} />
            </div>
            <p className={`mt-1.5 text-xs ${reached ? "font-medium text-foreground" : "text-muted-foreground"}`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function NativeTracking({
  order,
  awb,
  live,
}: {
  order: OrderTrackingInfo | null;
  awb: string;
  live: VelocityTrackResult;
}) {
  const statusLabel = live.current_status || live.shipment_status || "In transit";
  const isDelivered = statusLabel.toLowerCase() === "delivered";

  return (
    <div className="border-t pt-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          {order ? `Order ${order.order_number}` : `AWB ${awb}`}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-xl font-semibold md:text-2xl">{friendlyStatus(statusLabel)}</span>
          {isDelivered && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Delivered
            </span>
          )}
        </div>
        {live.courier_brand && (
          <p className="mt-1 text-xs text-muted-foreground">Shipped via {live.courier_brand}</p>
        )}
      </div>

      <StepTracker status={statusLabel} />

      {(live.origin || live.destination) && (
        <div className="mb-6 mt-6 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Origin</p>
            <p className="mt-0.5 text-sm font-medium">{live.origin || "—"}</p>
          </div>
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Destination</p>
            <p className="mt-0.5 text-sm font-medium">{live.destination || "—"}</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 border-y py-5 text-center">
        {live.estimated_delivery_date && !isDelivered && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Expected delivery</p>
            <span className="mt-1 inline-block rounded-full bg-green-100 px-4 py-1.5 text-lg font-semibold text-green-800">
              {formatDateOnly(live.estimated_delivery_date)}
            </span>
          </div>
        )}
        {live.delivered_date && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Delivered</p>
            <p className="mt-1 text-sm font-medium">{formatDate(live.delivered_date)}</p>
          </div>
        )}
      </div>

      {awb && (
        <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-muted/60 px-4 py-3 text-sm">
          {live.courier_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={live.courier_logo} alt={live.courier_brand || "Courier"} className="h-5 w-auto max-w-[90px] object-contain" />
          ) : (
            live.courier_brand && <span className="font-medium text-foreground">{live.courier_brand}</span>
          )}
          <span className="text-muted-foreground">Tracking ID:</span>
          <a
            href={live.track_url || `${VELOCITY_TRACK_BASE_URL}/${encodeURIComponent(awb)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-2"
          >
            {awb}
          </a>
        </div>
      )}

      {live.activities.length > 0 && (
        <div className="mt-8">
          <p className="mb-5 text-sm uppercase tracking-widest text-muted-foreground">Tracking updates</p>
          <ol>
            {live.activities.map((activity, i) => (
              <li key={`${activity.date}-${i}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-[#e86c5f]" : "bg-muted-foreground/30"}`} />
                  {i < live.activities.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                </div>
                <div className="pb-6">
                  <p className={`text-sm ${i === 0 ? "font-medium" : "text-muted-foreground"}`}>{activity.activity}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {activity.location} · {formatDate(activity.date)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// Raw Velocity status values that need a friendlier, less alarming label
// for customers than a literal translation of their internal wording.
const STATUS_LABEL_OVERRIDES: Record<string, string> = {
  not_picked: "Waiting for update",
};

function friendlyStatus(value: string) {
  const key = value.trim().toLowerCase().replace(/\s+/g, "_");
  return STATUS_LABEL_OVERRIDES[key] ?? formatState(value);
}

function formatState(value: string) {
  return value
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Date only, with year, no time — for the large "Expected delivery"
// headline (e.g. "21 Sept 2026"), matching the DTDC-style big date treatment.
function formatDateOnly(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
