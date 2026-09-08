import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Suspense } from "react";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import { getStoreDescription, getStoreName } from "@/lib/store";

const spreeApiOrigin = (() => {
  try {
    return process.env.SPREE_API_URL
      ? new URL(process.env.SPREE_API_URL).origin
      : undefined;
  } catch {
    return undefined;
  }
})();

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const rootStoreName = getStoreName();

export const viewport: Viewport = {
  themeColor: "#F07867",
};

export const metadata: Metadata = {
  title: {
    template: `%s | ${rootStoreName}`,
    default: rootStoreName,
  },
  description: getStoreDescription(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {spreeApiOrigin && (
          <>
            <link rel="preconnect" href={spreeApiOrigin} />
            <link rel="dns-prefetch" href={spreeApiOrigin} />
          </>
        )}

        {/* Defines window.plausible as a queueing stub, so any plausible()
            call made before the real tracking script finishes loading gets
            queued instead of erroring. Safe to run this every time (it's
            a no-op if window.plausible already exists), so it stays as a
            normal next/script - only the scripts that make real network
            requests need the manual-load guard (see AnalyticsScripts). */}
        <Script
          id="plausible-queue-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
          }}
        />
      </head>
      <body
        className={`${geist.variable} antialiased min-h-screen flex flex-col`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
