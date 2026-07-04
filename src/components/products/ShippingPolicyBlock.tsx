"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function ShippingPolicyBlock() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 border rounded-lg">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-gray-900">
          Shipping policy
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed space-y-2">
          <p>
            We aim to deliver your favorite fragrances safely and quickly.
          </p>
          <p>
            <span className="font-medium text-gray-900">
              Shipping Coverage.
            </span>{" "}
            We currently ship across pan India.
          </p>
          <p>
            <span className="font-medium text-gray-900">
              Processing &amp; Delivery.
            </span>{" "}
            Orders are processed within 1–2 business days after payment
            confirmation. Standard delivery time is 3–7 business days,
            depending on your location. You will receive tracking details
            via email once your order is dispatched. We generally ship with
            DTDC or Delhivery.
          </p>
          <p>
            <span className="font-medium text-gray-900">
              Shipping Charges.
            </span>{" "}
            Shipping fees are calculated at checkout and may vary based on
            delivery location and order size. Free shipping may be offered
            on orders above a certain value (check promotions).
          </p>
          <p>
            <span className="font-medium text-gray-900">Delays.</span>{" "}
            Delivery timelines are estimates and may be affected by courier
            delays, holidays, or unforeseen events. NOZ Fragrances is not
            liable for delays beyond our control.
          </p>
          <p className="text-xs text-gray-400">
            Effective Date: 29 Sep 2025.
          </p>
        </div>
      )}
    </div>
  );
}
