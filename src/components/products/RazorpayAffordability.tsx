"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface RazorpayAffordabilityProps {
  amount: number;
  currency?: string;
  clientKey: string;
}

export function RazorpayAffordability({
  amount,
  currency = "INR",
  clientKey,
}: RazorpayAffordabilityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track if the script is loaded (handles both initial load and client-side navigation)
  const [isScriptLoaded, setIsScriptLoaded] = useState(() => {
    return typeof window !== "undefined" && !!(window as any).RazorpayAffordabilitySuite;
  });

  useEffect(() => {
    // Wait until the script is loaded AND the container exists
    if (!isScriptLoaded || !containerRef.current) return;
    
    // Prevent double-rendering in React Strict Mode
    if (containerRef.current.hasChildNodes()) return;

    try {
      const suite = new (window as any).RazorpayAffordabilitySuite({
        key: clientKey,
        amount: amount,
        currency: currency,
        display: {
          widget: {
            main: {
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

      suite.render(containerRef.current);
    } catch (err) {
      console.error("Razorpay Widget Error:", err);
    }
  }, [amount, currency, clientKey, isScriptLoaded]); // Re-run when script finishes loading!

  if (!clientKey || amount <= 0) return null;

  return (
    <div className="w-full my-4 min-h-[100px]">
      <Script 
        src="https://cdn.razorpay.com/widgets/affordability/affordability.js" 
        strategy="afterInteractive"
        onReady={() => setIsScriptLoaded(true)}
      />
      <div ref={containerRef} id="razorpay-affordability-widget" />
    </div>
  );
}
