"use client";

import type { CustomField } from "@spree/sdk";
import { useState } from "react";

interface ProductScentIntensityProps {
  customFields?: Array<CustomField>;
}

const INTENSITY_LABELS: Record<number, string> = {
  1: "LIGHT",
  2: "SIGNIFICANT",
  3: "INTENSE",
};

const INTENSITY_DESCRIPTIONS: Record<number, string> = {
  1: "Soft and subtle — perfect for everyday wear",
  2: "Balanced projection — noticeable without being overwhelming",
  3: "Bold and powerful — long-lasting, leaves a statement",
};

/**
 * ProductScentIntensity
 * ---------------------
 * Reads from a custom field with label "Scent Intensity" on the Spree product.
 *
 * In Spree Admin → Product → Custom Fields, create:
 *   Label: "Scent Intensity"   Type: Integer
 *   Value: 1 (Light), 2 (Significant), or 3 (Intense)
 */
export function ProductScentIntensity({ customFields }: ProductScentIntensityProps) {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

  if (!customFields || customFields.length === 0) return null;

  const intensityField = customFields.find(
    (f) => f.label?.toLowerCase() === "scent intensity",
  );
  if (!intensityField) return null;

  const level = parseInt(String(intensityField.value), 10);
  if (isNaN(level) || level < 1 || level > 3) return null;

  const displayLabel = INTENSITY_LABELS[hoveredLevel ?? level] ?? INTENSITY_LABELS[level];

  return (
    <div className="mt-6">
      <p
        style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#888",
          marginBottom: "10px",
        }}
      >
        SCENT-INTENSITY
      </p>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          border: "1px solid #e5e5e5",
          borderRadius: "999px",
        }}
      >
        {[1, 2, 3].map((dotLevel) => {
          const isFilled = dotLevel <= (hoveredLevel ?? level);
          const isHovering = hoveredLevel === dotLevel;
          return (
            <button
              key={dotLevel}
              type="button"
              onMouseEnter={() => setHoveredLevel(dotLevel)}
              onMouseLeave={() => setHoveredLevel(null)}
              aria-label={`Scent intensity ${dotLevel} of 3: ${INTENSITY_LABELS[dotLevel]}`}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.18s ease",
                backgroundColor: isFilled ? "#EF776A" : "#e0e0e0",
                transform: isHovering ? "scale(1.25)" : "scale(1)",
                outline: "none",
              }}
            />
          );
        })}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "#546470",
            textTransform: "uppercase",
            marginLeft: "4px",
            minWidth: "90px",
          }}
        >
          {displayLabel}
        </span>
      </div>

      {hoveredLevel && (
        <p style={{ fontSize: "12px", color: "#777", marginTop: "6px", fontStyle: "italic" }}>
          {INTENSITY_DESCRIPTIONS[hoveredLevel]}
        </p>
      )}
    </div>
  );
}
