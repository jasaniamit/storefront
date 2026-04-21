"use client";

/**
 * AnnouncementBar
 * Continuously scrolling ticker — right to left.
 * Edit `messages` array to change text.
 */

const messages = [
  "Free Shipping On Order Above ₹999/-",
  "Premium-Quality Fragrances · No Excessive Markups",
  "Proud to be an Indian Brand 🇮🇳",
  "2ml Samples Available · Try Before You Buy",
];

export function AnnouncementBar() {
  const track = [...messages, ...messages];

  return (
    <div
      style={{
        backgroundColor: "#F5F5F4",
        borderBottom: "1px solid #ebebeb",
        height: "36px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        width: "100%",
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
          animation: noz-marquee 32s linear infinite;
          will-change: transform;
        }
        .noz-marquee-track:hover {
          animation-play-state: paused;
        }
        .noz-marquee-item {
          display: inline-flex;
          align-items: center;
          padding: 0 48px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: #000000;
          white-space: nowrap;
          font-family: inherit;
        }
        .noz-marquee-dot {
          display: inline-block;
          margin-left: 48px;
          color: #000000;
          opacity: 0.35;
          font-size: 7px;
        }
      `}</style>

      <div className="noz-marquee-track">
        {track.map((msg, i) => (
          <span key={i} className="noz-marquee-item">
            {msg}
            <span className="noz-marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
