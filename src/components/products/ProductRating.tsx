"use client";

import type { CustomField } from "@spree/sdk";

interface ProductRatingProps {
  customFields?: Array<CustomField>;
}

/**
 * ProductRating
 * -------------
 * Reads from custom fields with these labels on the Spree product:
 *
 * In Spree Admin → Product → Custom Fields, create:
 *   Label: "Reviews Rating"   Type: Decimal   Value: 4.9
 *   Label: "Reviews Count"    Type: Integer   Value: 87
 *   Label: "Reviews Verified" Type: Boolean   Value: true
 *
 * Displays: ★★★★★  4.9 Stars (87 Reviews)  ● Verified Purchase
 */
export function ProductRating({ customFields }: ProductRatingProps) {
  if (!customFields || customFields.length === 0) return null;

  const getField = (label: string) =>
    customFields.find((f) => f.label?.toLowerCase() === label.toLowerCase());

  const ratingField = getField("reviews rating");
  if (!ratingField) return null;

  const rating = parseFloat(String(ratingField.value));
  if (isNaN(rating)) return null;

  const countField = getField("reviews count");
  const verifiedField = getField("reviews verified");

  const count = countField ? parseInt(String(countField.value), 10) : null;
  const isVerified = verifiedField
    ? String(verifiedField.value) === "true" || verifiedField.value === true
    : false;

  const stars = buildStars(rating);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
        marginTop: "8px",
      }}
    >
      <div style={{ display: "flex", gap: "2px" }}>
        {stars.map((type, i) => (
          <StarIcon key={i} type={type} />
        ))}
      </div>
      <span style={{ fontSize: "13px", color: "#546470", fontWeight: 500 }}>
        {rating.toFixed(1)} Stars
        {count != null && !isNaN(count) && ` (${count} Reviews)`}
      </span>
      {isVerified && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            color: "#546470",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#1a1a1a",
              display: "inline-block",
            }}
          />
          Verified Purchase
        </span>
      )}
    </div>
  );
}

type StarType = "full" | "half" | "empty";

function buildStars(rating: number): StarType[] {
  return Array.from({ length: 5 }, (_, i) => {
    const pos = i + 1;
    if (rating >= pos) return "full";
    if (rating >= pos - 0.5) return "half";
    return "empty";
  });
}

function StarIcon({ type }: { type: StarType }) {
  const color = "#EF776A";
  const emptyColor = "#ddd";
  const path = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

  if (type === "full") {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill={color}><path d={path} /></svg>;
  }
  if (type === "half") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="noz-half-star">
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor={emptyColor} />
          </linearGradient>
        </defs>
        <path d={path} fill="url(#noz-half-star)" />
      </svg>
    );
  }
  return <svg width="16" height="16" viewBox="0 0 24 24" fill={emptyColor}><path d={path} /></svg>;
}
