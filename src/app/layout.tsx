import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Suspense } from "react";
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

        {/* Self-hosted Plausible-style Analytics - proxied through this
            domain's own /js and /vg paths (see next.config.ts rewrites)
            instead of loading directly from stats.nozfragrances.com, so ad
            blockers see a same-origin request instead of a third-party
            analytics domain with a tracking-shaped filename. */}
        <Script
          defer
          data-domain="nozfragrances.com"
          data-api="/vg/events"
          src="/js/vg-insights.js"
          strategy="afterInteractive"
        />
        <Script
          id="plausible-queue-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
          }}
        />

        {/* Umami Analytics (cloud) - NOT proxied yet. cloud.umami.is is a
            known analytics domain and is commonly blocklisted by name, so
            this one is very likely still being silently blocked by ad
            blockers the same way Plausible was before the fix above. Left
            as-is for now - ask before proxying this one too. */}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="26c905b8-4b5f-4133-8e08-d03512494514"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geist.variable} antialiased min-h-screen flex flex-col`}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
