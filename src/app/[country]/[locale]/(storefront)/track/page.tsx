// src/app/[country]/[locale]/(storefront)/track/page.tsx
import type { Metadata } from "next";
import TrackClientPage from "./TrackClientPage";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Enter your Order Id or AWB number to see live shipping status.",
};

export default function TrackPage() {
  return <TrackClientPage />;
}
