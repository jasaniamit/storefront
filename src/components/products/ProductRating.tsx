"use client";

import type { CustomField } from "@spree/sdk";

interface ProductRatingProps {
  customFields?: Array<CustomField>;
}

/**
 * ProductRating
 * -------------
 * Reads from two custom fields on the Spree product:
 *   - "reviews_rating"  → number (e.g. 4.9)
 *   - "reviews_count"   → number (e.g. 87)
 *   - "reviews_verified" → boolean (shows "Verified Purchase" badge)
 *
 * In Spree Admin → Product → Custom Fields, create:
 *   Name: "reviews_rating"   Type: Decimal   Value: 4.9
 *   Name: "reviews_count"    Type: Integer   Value: 87
 *   Name: "reviews_verified" Type: Boolean   Value: true
 *
 * Displays: ★★★★★  4.9 Stars (87 Reviews)  ● Verified Purchase
 * — matching the design in Product_Page-01.jpg
 */
export function ProductRating({ customFields }: ProductRatingProps) {
  if (!customFields || customFields.length === 0) return null;

  const getField = (name: string) =>
    customFields.find((f) => f.name?.toLowerCase() === name);

  const ratingField = getField("reviews_rating");
  const countField = getField("reviews_count");
  const verifiedField = getField("reviews_verified");

  if (!ratingField) return null;

  const rating = parseFloat(String(ratingField.value));
  if (isNaN(rating)) return null;

  const count = countField ? parseInt(String(countField.value), 10) : null;
  const isVerified = verifiedField
    ? String(verifiedField.value) === "true" || verifiedField.value === true
    : false;

  // Build star display (full, half, empty)
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
      {/* Star row */}
      <div style={{ display: "flex", gap: "2px" }}>
        {stars.map((type, i) => (
          <StarIcon key={i} type={type} />
        ))}
      </div>

      {/* Rating text */}
      <span
        style={{
          fontSize: "13px",
          color: "#546470",
          fontWeight: 500,
        }}
      >
        {rating.toFixed(1)} Stars
        {count != null && !isNaN(count) && ` (${count} Reviews)`}
      </span>

      {/* Verified badge */}
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
              flexShrink: 0,
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
  const stars: StarType[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push("full");
    } else if (rating >= i - 0.5) {
      stars.push("half");
    } else {
      stars.push("empty");
    }
  }
  return stars;
}

function StarIcon({ type }: { type: StarType }) {
  const color = "#EF776A";
  const emptyColor = "#ddd";

  if (type === "full") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  if (type === "half") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="half-star">
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor={emptyColor} />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#half-star)"
        />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={emptyColor}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
