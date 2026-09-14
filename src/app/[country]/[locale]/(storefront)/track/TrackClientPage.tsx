// src/app/[country]/[locale]/(storefront)/track/TrackClientPage.tsx
"use client";

import { useState } from "react";
import { Package, Search, MapPin, CheckCircle2, Truck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  consignee_name: string | null;
  pickup_date: string | null;
  delivered_date: string | null;
  activities: VelocityTrackActivity[];
  track_url: string | null;
}

interface SearchResponse {
  type: "order" | "awb";
  order: OrderTrackingInfo | null;
  live: VelocityTrackResult | null;
}

type Status = "idle" | "loading" | "success" | "error";

export default function TrackClientPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<SearchResponse | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <div className="mb-8 text-center">
        <Package className="mx-auto mb-3 h-10 w-10 text-primary" />
        <h1 className="text-2xl font-semibold md:text-3xl">Track Your Order</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your Order Id or AWB number from your confirmation email.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
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
  const { order, live } = data;

  // Order found in Spree, but not shipped yet — nothing to ask Velocity.
  if (order && !order.shipped) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5 text-muted-foreground" />
            Order {order.order_number}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This order is <span className="font-medium text-foreground">{formatState(order.order_state)}</span> and
            hasn&apos;t shipped yet. Once it ships, tracking details will appear here automatically.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Have live Velocity data (either via order lookup + AWB, or a direct AWB search).
  if (live?.found) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Truck className="h-5 w-5 text-primary" />
            {order ? `Order ${order.order_number}` : "Shipment"}
          </CardTitle>
          {order?.awb_code && (
            <p className="text-xs text-muted-foreground">AWB: {order.awb_code}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <StatusBadge status={live.current_status || live.shipment_status} />
          </div>

          {(live.origin || live.destination) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {live.origin ?? "—"} → {live.destination ?? "—"}
            </div>
          )}

          {live.activities.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="mb-3 text-sm font-medium">Tracking history</h3>
              <ol className="space-y-3">
                {live.activities.map((activity, i) => (
                  <li key={`${activity.date}-${i}`} className="flex gap-3 text-sm">
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${i === 0 ? "text-primary" : "text-muted-foreground/40"}`}
                    />
                    <div>
                      <p className={i === 0 ? "font-medium" : "text-muted-foreground"}>{activity.activity}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.location} · {formatDate(activity.date)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {live.track_url && (
            <a
              href={live.track_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-primary underline underline-offset-2"
            >
              View on carrier&apos;s tracking page
            </a>
          )}
        </CardContent>
      </Card>
    );
  }

  // Order found and marked shipped in Spree, but Velocity's live API had no
  // data for it (e.g. briefly unavailable) — fall back to what Spree knows
  // rather than showing a hard error.
  if (order?.shipped) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Truck className="h-5 w-5 text-primary" />
            Order {order.order_number}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            This order has shipped{order.shipped_at ? ` on ${formatDate(order.shipped_at)}` : ""}.
          </p>
          {order.tracking_url ? (
            <a
              href={order.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-primary underline underline-offset-2"
            >
              View carrier tracking
            </a>
          ) : (
            <p className="text-xs text-muted-foreground">
              Live carrier status is temporarily unavailable — please check back shortly.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}

function StatusBadge({ status }: { status: string | null }) {
  const label = status ? formatState(status) : "Status unavailable";
  const isDelivered = status?.toLowerCase() === "delivered";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
        isDelivered ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
      }`}
    >
      {isDelivered ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
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
