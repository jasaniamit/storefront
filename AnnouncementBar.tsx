import React from "react";

/**
 * AnnouncementBar
 * ---------------
 * A full-width, continuously scrolling ticker (right → left marquee).
 * Add or edit messages in the `messages` array below.
 * Placed above <Header> in the storefront layout.
 */

const messages = [
  "Free Shipping On Order Above ₹999/-",
  "Premium-Quality Fragrances · No Excessive Markups",
  "Proud to be an Indian Brand 🇮🇳",
  "2ml Samples Available · Try Before You Buy",
];

export function AnnouncementBar() {
  // Duplicate the list so the loop appears seamless
  const track = [...messages, ...messages];

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        backgroundColor: "#F5F5F4",
        borderBottom: "1px solid #f0f0f0",
        height: "36px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <style>{`
        @keyframes noz-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .noz-marquee-track {
          display: flex;
          width: max-content;
          animation: noz-marquee 28s linear infinite;
          will-change: transform;
        }
        .noz-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="noz-marquee-track" aria-hidden="false">
        {track.map((msg, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              paddingInline: "48px",
              fontSize: "12px",
              fontWeight: 320,
              letterSpacing: "0.06em",
              color: "#EF776A",
              whiteSpace: "nowrap",
            }}
          >
            {msg}
            <span
              style={{
                display: "inline-block",
                marginLeft: "48px",
                color: "#EF776A",
                opacity: 0.4,
                fontSize: "8px",
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
