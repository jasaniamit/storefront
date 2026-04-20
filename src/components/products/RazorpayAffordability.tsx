"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface RazorpayAffordabilityProps {
  amount: number; // in paise
  currency?: string;
  clientKey: string;
}

export function RazorpayAffordability({
  amount,
  currency = "INR",
  clientKey,
}: RazorpayAffordabilityProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we don't render multiple iframes if React strict mode double-fires
    if (!containerRef.current || containerRef.current.hasChildNodes()) return;
    if (!(window as any).RazorpayAffordabilitySuite) return;

    try {
      const suite = new (window as any).RazorpayAffordabilitySuite({
        key: clientKey,
        amount: amount,
        currency: currency,
        display: {
          widget: {
            main: {
              // You can expose these as props later if you want to control them from Next.js
              heading: { color: "#000000", fontSize: "14px" },
              content: { backgroundColor: "#ffffff", color: "#000000" },
              discount: { color: "#e60099" },
              link: { button: true, color: "#000000" },
            },
          },
          offers: true,
          emi: true,
          cardlessEmi: true,
          paylater: true,
        },
      });

      // Render directly into our React ref container
      suite.render(containerRef.current);
    } catch (err) {
      console.error("Razorpay Widget Error:", err);
    }
  }, [amount, currency, clientKey]);

  if (!clientKey || amount <= 0) return null;

  return (
    <div className="w-full my-4 min-h-[100px]">
      <Script 
        src="https://cdn.razorpay.com/widgets/affordability/affordability.js" 
        strategy="lazyOnload" 
      />
      <div ref={containerRef} id="razorpay-affordability-widget" />
    </div>
  );
}
