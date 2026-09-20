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
  viewportFit: "cover", // lets the sticky bar respect iPhone safe-area (home indicator)
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

        {/* Umami Analytics (cloud) */}
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
