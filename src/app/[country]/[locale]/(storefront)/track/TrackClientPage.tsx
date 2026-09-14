// src/app/[country]/[locale]/(storefront)/track/TrackClientPage.tsx
"use client";

import { useState } from "react";
import { Package, Search, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Velocity's own public tracking page — no auth needed, works for any AWB
// regardless of how the shipment was created (bulk CSV upload or their
// Custom API). We embed this directly rather than re-implementing our own
// live-status UI on top of their authenticated API, which doesn't
// reliably cover CSV-manifested shipments.
const VELOCITY_TRACK_BASE_URL = "https://www.velocityshipping.in/track";

interface OrderTrackingInfo {
  order_number: string;
  order_state: string;
  shipped: boolean;
  awb_code: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
}

interface SearchResponse {
  type: "order" | "awb";
  order: OrderTrackingInfo | null;
  awb: string | null;
}

type Status = "idle" | "loading" | "success" | "error";

export default function TrackClientPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [iframeFailed, setIframeFailed] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMessage("");
    setResult(null);
    setIframeFailed(false);

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
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
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

      {status === "success" && result && (
        <TrackingResult data={result} iframeFailed={iframeFailed} onIframeError={() => setIframeFailed(true)} />
      )}
    </div>
  );
}

function TrackingResult({
  data,
  iframeFailed,
  onIframeError,
}: {
  data: SearchResponse;
  iframeFailed: boolean;
  onIframeError: () => void;
}) {
  const { order, awb } = data;

  // Order found in Spree, but not shipped yet — nothing to track.
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

  // Order shipped but no AWB recorded yet (webhook hasn't caught up).
  if (order && order.shipped && !awb) {
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
            This order has shipped and tracking details are being updated — please check back shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!awb) return null;

  const trackUrl = `${VELOCITY_TRACK_BASE_URL}/${encodeURIComponent(awb)}`;

  return (
    <Card className="overflow-hidden">
      {order && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Order {order.order_number}</CardTitle>
          <p className="text-xs text-muted-foreground">AWB: {awb}</p>
        </CardHeader>
      )}
      <CardContent className="p-0">
        {!iframeFailed && (
          <iframe
            src={trackUrl}
            title="Shipment tracking"
            className="h-[520px] w-full border-0"
            onError={onIframeError}
          />
        )}

        {/* Always shown, not just as an error fallback — some browsers
            don't fire onError for a blocked/refused iframe, so this is
            the guaranteed-working path regardless of what Velocity's
            page does with embedding. */}
        <div className="flex justify-center border-t p-4">
          <a
            href={trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-2"
          >
            Open full tracking page <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function formatState(value: string) {
  return value
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
