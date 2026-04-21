import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Suspense } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { getStoreDescription, getStoreName } from "@/lib/store";

const gtmId = process.env.GTM_ID;
const spreeApiOrigin = (() => {
  try {
    return process.env.SPREE_API_URL
      ? new URL(process.env.SPREE_API_URL).origin
      : undefined;
  } catch {
    return undefined;
  }
})();

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const rootStoreName = getStoreName();

export const metadata: Metadata = {
  title: {
    template: `%s | ${rootStoreName}`,
    default: rootStoreName,
  },
  description: getStoreDescription(),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#F07867" />
        {spreeApiOrigin && (
          <>
            <link rel="preconnect" href={spreeApiOrigin} />
            <link rel="dns-prefetch" href={spreeApiOrigin} />
          </>
        )}
        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="2xFrdGjJnYdcBJmAFTd6Fw"
          strategy="afterInteractive"
        />
        {/* Plausible Analytics */}
        <Script
          defer
          data-domain="nozfragrances.com"
          src="https://stats.nozfragrances.com/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">{`
          window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
        `}</Script>
        {/* Umami Analytics */}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="26c905b8-4b5f-4133-8e08-d03512494514"
          strategy="afterInteractive"
        />
      </head>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col`}
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
      >
        <Suspense fallback={null}>
          <CartProvider>{children}</CartProvider>
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
