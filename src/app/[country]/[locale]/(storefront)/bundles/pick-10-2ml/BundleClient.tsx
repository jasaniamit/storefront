"use client";

import type { Product } from "@spree/sdk";
import { Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { addToCart, applyCouponCode } from "@/lib/data/cart";

const BRAND = "#546470";
const CORAL = "#EF776A";

interface BundleClientProps {
  products: Product[];
  basePath: string;
  bundleSize: number;
  bundlePrice: number;
  originalPrice: number;
  promoCode: string;
  shippingNote: string;
}

interface SelectedItem {
  product: Product;
  variantId: string;
  image: string;
  name: string;
}

export function BundleClient({
  products,
  basePath,
  bundleSize,
  bundlePrice,
  originalPrice,
  promoCode,
  shippingNote,
}: BundleClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSelected = selected.length;
  const remaining = bundleSize - totalSelected;
  const isComplete = totalSelected === bundleSize;
  const savings = originalPrice - bundlePrice;

  // Add one instance of a product
  const handleAdd = useCallback(
    (product: Product) => {
      if (totalSelected >= bundleSize) return;

      // default_variant_id is always present; default_variant only when expanded
      const variantId =
        product.default_variant?.id ??
        product.default_variant_id ??
        (Array.isArray(product.variants) && product.variants[0]?.id
          ? product.variants[0].id
          : null);

      if (!variantId) return;

      const image = product.thumbnail_url ?? "";

      setSelected((prev) => [
        ...prev,
        {
          product,
          variantId,
          image,
          name: product.name,
        },
      ]);
    },
    [totalSelected, bundleSize],
  );

  // Remove one instance of a product
  const handleRemove = useCallback((product: Product) => {
    setSelected((prev) => {
      const idx = [...prev]
        .reverse()
        .findIndex((s) => s.product.id === product.id);
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      return prev.filter((_, i) => i !== realIdx);
    });
  }, []);

  // Remove a specific slot
  const handleRemoveSlot = useCallback((index: number) => {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Count how many of this product are selected
  const countOf = useCallback(
    (product: Product) =>
      selected.filter((s) => s.product.id === product.id).length,
    [selected],
  );

  // Add all to cart + apply promo silently
  const handleAddToCart = useCallback(async () => {
    if (!isComplete) return;
    setLoading(true);
    setError(null);

    try {
      // Add all items to cart (sequentially to avoid race on cart creation)
      for (const item of selected) {
        const result = await addToCart(item.variantId, 1);
        if (!result.success) throw new Error(result.error ?? "Failed to add item");
      }

      // Auto-apply promo code silently
      await applyCouponCode(promoCode);

      // Redirect to cart
      router.push(`${basePath}/cart`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  }, [isComplete, selected, promoCode, basePath, router]);

  // Slots display
  const slots = useMemo(
    () =>
      Array.from({ length: bundleSize }, (_, i) => selected[i] ?? null),
    [selected, bundleSize],
  );

  return (
    <>
      <style>{`
        .bundle-page { min-height: 100vh; background: #fafaf9; }

        /* ── HERO ── */
        .bundle-hero {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          padding: 40px 24px 32px;
          text-align: center;
        }
        .bundle-hero-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${CORAL};
          margin-bottom: 10px;
        }
        .bundle-hero-title {
          font-family: Georgia, serif;
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          font-weight: 400;
          color: ${BRAND};
          line-height: 1.15;
          margin: 0 0 12px;
        }
        .bundle-hero-title strong { font-weight: 700; }
        .bundle-hero-price-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        .bundle-price-new {
          font-size: 2rem;
          font-weight: 700;
          color: ${BRAND};
        }
        .bundle-price-old {
          font-size: 1.1rem;
          color: #aaa;
          text-decoration: line-through;
        }
        .bundle-save-badge {
          background: #e8f5e8;
          color: #2d7a2d;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }
        .bundle-shipping-note {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }

        /* ── PROGRESS ── */
        .bundle-progress-wrap {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          padding: 20px 24px;
          position: sticky;
          top: 0;
          z-index: 30;
        }
        .bundle-progress-inner {
          max-width: 760px;
          margin: 0 auto;
        }
        .bundle-progress-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .bundle-progress-text {
          font-size: 13px;
          font-weight: 600;
          color: ${BRAND};
        }
        .bundle-progress-count {
          font-size: 12px;
          color: #999;
        }
        .bundle-progress-bar-bg {
          height: 6px;
          background: #f0f0f0;
          border-radius: 999px;
          overflow: hidden;
        }
        .bundle-progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: ${CORAL};
          transition: width 0.3s ease;
        }

        /* ── SLOTS TRAY ── */
        .bundle-slots-tray {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          padding: 16px 24px;
          overflow-x: auto;
          display: flex;
          justify-content: center;
        }
        .bundle-slots-inner {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 760px;
        }
        .bundle-slot {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          border: 1.5px dashed #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
          background: #fafaf9;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .bundle-slot.filled {
          border-style: solid;
          border-color: ${CORAL};
        }
        .bundle-slot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .bundle-slot-remove {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${CORAL};
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          z-index: 2;
        }
        .bundle-slot-empty-icon {
          color: #ddd;
          font-size: 18px;
          font-weight: 300;
        }

        /* ── PRODUCT GRID ── */
        .bundle-grid-section {
          padding: 24px 16px 120px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .bundle-grid-heading {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 16px;
          text-align: center;
        }
        .bundle-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 480px) {
          .bundle-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 768px) {
          .bundle-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .bundle-grid-section { padding: 32px 24px 140px; }
        }
        @media (min-width: 1024px) {
          .bundle-grid { grid-template-columns: repeat(5, 1fr); }
        }

        /* ── PRODUCT CARD ── */
        .bundle-card {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s, box-shadow 0.2s;
          cursor: pointer;
          position: relative;
        }
        .bundle-card:hover {
          border-color: ${BRAND};
          box-shadow: 0 4px 16px rgba(84,100,112,0.1);
        }
        .bundle-card.selected-card {
          border-color: ${CORAL};
        }
        .bundle-card-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: ${CORAL};
          color: white;
          font-size: 11px;
          font-weight: 700;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .bundle-card-img-wrap {
          aspect-ratio: 1;
          background: #f7f7f5;
          overflow: hidden;
        }
        .bundle-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .bundle-card:hover .bundle-card-img-wrap img {
          transform: scale(1.04);
        }
        .bundle-card-body {
          padding: 10px 10px 8px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .bundle-card-name {
          font-size: 11.5px;
          font-weight: 500;
          color: ${BRAND};
          line-height: 1.35;
          margin-bottom: 8px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bundle-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
        }
        .bundle-card-price {
          font-size: 11px;
          color: #aaa;
          text-decoration: line-through;
        }
        .bundle-card-stepper {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .bundle-stepper-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1.5px solid ${BRAND};
          background: transparent;
          color: ${BRAND};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: background 0.15s, color 0.15s;
        }
        .bundle-stepper-btn:hover:not(:disabled) {
          background: ${BRAND};
          color: white;
        }
        .bundle-stepper-btn:disabled {
          border-color: #ddd;
          color: #ddd;
          cursor: not-allowed;
        }
        .bundle-stepper-count {
          font-size: 13px;
          font-weight: 700;
          color: ${BRAND};
          min-width: 16px;
          text-align: center;
        }
        .bundle-add-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1.5px solid ${BRAND};
          background: transparent;
          color: ${BRAND};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: background 0.15s, color 0.15s;
        }
        .bundle-add-btn:hover:not(:disabled) {
          background: ${BRAND};
          color: white;
        }
        .bundle-add-btn:disabled {
          border-color: #ddd;
          color: #ddd;
          cursor: not-allowed;
        }

        /* ── STICKY FOOTER ── */
        .bundle-sticky-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: #fff;
          border-top: 1px solid #ebebeb;
          padding: 14px 20px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .bundle-cta-btn {
          width: 100%;
          max-width: 480px;
          padding: 16px;
          border-radius: 8px;
          border: none;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .bundle-cta-btn.ready {
          background: ${CORAL};
          color: white;
        }
        .bundle-cta-btn.ready:hover:not(:disabled) {
          opacity: 0.88;
        }
        .bundle-cta-btn.not-ready {
          background: #e8e8e8;
          color: #aaa;
          cursor: not-allowed;
        }
        .bundle-cta-btn:disabled {
          cursor: not-allowed;
        }
        .bundle-footer-hint {
          font-size: 11.5px;
          color: #aaa;
          text-align: center;
        }
        .bundle-error {
          font-size: 12px;
          color: #d32f2f;
          text-align: center;
        }
      `}</style>

      <div className="bundle-page">

        {/* ── HERO ── */}
        <div className="bundle-hero">
          <p className="bundle-hero-eyebrow">NOZ Discovery Bundle</p>
          <h1 className="bundle-hero-title">
            Pick Any <strong>{bundleSize} × 2ml</strong> Samples
          </h1>
          <div className="bundle-hero-price-row">
            <span className="bundle-price-new">₹{bundlePrice}</span>
            <span className="bundle-price-old">₹{originalPrice}</span>
            <span className="bundle-save-badge">SAVE ₹{savings}</span>
          </div>
          <p className="bundle-shipping-note">{shippingNote}</p>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="bundle-progress-wrap">
          <div className="bundle-progress-inner">
            <div className="bundle-progress-label">
            <span className="bundle-progress-text">
              {isComplete
                ? "✓ Selection complete! Ready to add to cart"
                : remaining === bundleSize
                  ? `Pick any ${bundleSize} fragrances`
                  : `${remaining} more to go`}
            </span>
            <span className="bundle-progress-count">
              {totalSelected}/{bundleSize}
            </span>
          </div>
          <div className="bundle-progress-bar-bg">
            <div
              className="bundle-progress-bar-fill"
              style={{ width: `${(totalSelected / bundleSize) * 100}%` }}
            />
            </div>
          </div>
        </div>

        {/* ── SLOTS TRAY ── */}
        <div className="bundle-slots-tray">
          <div className="bundle-slots-inner">
            {slots.map((item, i) => (
              <div
                key={i}
                className={`bundle-slot ${item ? "filled" : ""}`}
              >
                {item ? (
                  <>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="bundle-slot-img"
                      />
                    ) : (
                      <span style={{ fontSize: "20px", color: BRAND }}>
                        {item.name.charAt(0)}
                      </span>
                    )}
                    <button
                      className="bundle-slot-remove"
                      onClick={() => handleRemoveSlot(i)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={9} strokeWidth={3} />
                    </button>
                  </>
                ) : (
                  <span className="bundle-slot-empty-icon">+</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── PRODUCT GRID ── */}
        <div className="bundle-grid-section">
          <p className="bundle-grid-heading">
            {products.length} fragrances available — mix &amp; match freely
          </p>
          <div className="bundle-grid">
            {products.map((product) => {
              const count = countOf(product);
              const isSelected = count > 0;
              const imgUrl = product.thumbnail_url ?? null;
              const price =
                product.price?.display_amount ?? "₹50";

              return (
                <div
                  key={product.id}
                  className={`bundle-card ${isSelected ? "selected-card" : ""}`}
                >
                  {isSelected && (
                    <div className="bundle-card-badge">
                      {count}
                    </div>
                  )}

                  {/* Image */}
                  <div className="bundle-card-img-wrap">
                    {imgUrl ? (
                      <img src={imgUrl} alt={product.name} loading="lazy" />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "2rem",
                          color: "#ddd",
                        }}
                      >
                        {product.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="bundle-card-body">
                    <p className="bundle-card-name">{product.name}</p>
                    <div className="bundle-card-actions">
                      <span className="bundle-card-price">{price}</span>

                      {isSelected ? (
                        /* Stepper when already selected */
                        <div className="bundle-card-stepper">
                          <button
                            className="bundle-stepper-btn"
                            onClick={() => handleRemove(product)}
                            aria-label="Remove one"
                          >
                            <Minus size={11} strokeWidth={2.5} />
                          </button>
                          <span className="bundle-stepper-count">{count}</span>
                          <button
                            className="bundle-stepper-btn"
                            onClick={() => handleAdd(product)}
                            disabled={isComplete}
                            aria-label="Add one more"
                          >
                            <Plus size={11} strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        /* Add button when not selected */
                        <button
                          className="bundle-add-btn"
                          onClick={() => handleAdd(product)}
                          disabled={isComplete}
                          aria-label={`Add ${product.name}`}
                        >
                          <Plus size={13} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STICKY FOOTER ── */}
        <div className="bundle-sticky-footer">
          {error && <p className="bundle-error">{error}</p>}

          <button
            className={`bundle-cta-btn ${isComplete ? "ready" : "not-ready"}`}
            onClick={handleAddToCart}
            disabled={!isComplete || loading}
          >
            {loading ? (
              "Adding to cart..."
            ) : isComplete ? (
              <>
                <ShoppingBag size={16} />
                Add {bundleSize} to Cart — ₹{bundlePrice}
              </>
            ) : (
              `Pick ${remaining} more fragrance${remaining !== 1 ? "s" : ""}`
            )}
          </button>

          <p className="bundle-footer-hint">
            {isComplete
              ? `₹${savings} saved · ${shippingNote}`
              : `${totalSelected} of ${bundleSize} selected · ₹${bundlePrice} total`}
          </p>
        </div>

      </div>
    </>
  );
}
