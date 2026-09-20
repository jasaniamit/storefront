"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductImage } from "@/components/ui/product-image";

interface StickyMobileCartBarProps {
  /** Thumbnail URL (small/mini variant of the product image) */
  imageUrl: string | null;
  name: string;
  /** Selected variant text, e.g. "50ml" */
  optionsText?: string | null;
  price?: string;
  strikethroughPrice?: string | null;
  loading: boolean;
  purchasable: boolean;
  addToCartLabel: string;
  addingLabel: string;
  outOfStockLabel: string;
  onAddToCart: () => void;
  /** id of the inline Add-to-Cart wrapper. Bar appears once it scrolls out of view. */
  inlineCtaId: string;
}

/**
 * Sticky "Add to Cart" bar pinned to the bottom of the viewport.
 * MOBILE ONLY (`md:hidden` => hidden from 768px up).
 *
 * Visibility rules:
 *  - hidden while the regular Add to Cart button is on screen (no duplicate CTA)
 *  - hidden when the footer is on screen (so it never covers footer content)
 */
export function StickyMobileCartBar({
  imageUrl,
  name,
  optionsText,
  price,
  strikethroughPrice,
  loading,
  purchasable,
  addToCartLabel,
  addingLabel,
  outOfStockLabel,
  onAddToCart,
  inlineCtaId,
}: StickyMobileCartBarProps) {
  const [inlineCtaVisible, setInlineCtaVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const inlineEl = document.getElementById(inlineCtaId);
    const footerEl = document.querySelector("footer");

    const inlineObserver = new IntersectionObserver(([entry]) => {
      // Only treat it as "scrolled past" if it left through the TOP.
      // (If it's below the fold on first load we still want the bar.)
      setInlineCtaVisible(
        entry.isIntersecting || entry.boundingClientRect.top > 0,
      );
    });
    const footerObserver = new IntersectionObserver(([entry]) =>
      setFooterVisible(entry.isIntersecting),
    );

    if (inlineEl) inlineObserver.observe(inlineEl);
    if (footerEl) footerObserver.observe(footerEl);

    return () => {
      inlineObserver.disconnect();
      footerObserver.disconnect();
    };
  }, [inlineCtaId]);

  const show = !inlineCtaVisible && !footerVisible;

  return (
    <div
      aria-hidden={!show}
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 bg-[#F07867] text-white shadow-[0_-4px_16px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out pb-[env(safe-area-inset-bottom)] ${
        show ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* Product image */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white">
          <ProductImage
            src={imageUrl}
            alt={name}
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>

        {/* Name + price */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">
            {name}
            {optionsText ? ` · ${optionsText}` : ""}
          </p>
          <p className="mt-0.5 flex items-baseline gap-2">
            {price && <span className="text-base font-bold">{price}</span>}
            {strikethroughPrice && (
              <span className="text-xs line-through opacity-80">
                {strikethroughPrice}
              </span>
            )}
          </p>
        </div>

        {/* CTA (white on brand colour for contrast) */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={loading || !purchasable}
          tabIndex={show ? 0 : -1}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white px-4 text-sm font-semibold text-[#1a1a1a] transition active:scale-95 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {addingLabel}
            </>
          ) : purchasable ? (
            <>
              <ShoppingBag className="h-4 w-4" />
              {addToCartLabel}
            </>
          ) : (
            outOfStockLabel
          )}
        </button>
      </div>
    </div>
  );
}
