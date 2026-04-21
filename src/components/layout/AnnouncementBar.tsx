"use client";

import { useEffect, useState } from "react";

const messages = [
  "Free Shipping On Order Above ₹999/-",
  "Premium-Quality Fragrances · No Excessive Markups",
  "Proud to be an Indian Brand 🇮🇳",
  "2ml Samples Available · Try Before You Buy",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "enter") {
      timer = setTimeout(() => setPhase("hold"), 600);
    } else if (phase === "hold") {
      timer = setTimeout(() => setPhase("exit"), 2500);
    } else if (phase === "exit") {
      // 🔥 IMPORTANT: wait before switching message (prevents overlap)
      timer = setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setPhase("enter");
      }, 600); // slightly longer than exit animation
    }

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #ebebeb",
        height: "32px", // slimmer like reference
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes noz-slide-in {
          from { transform: translateX(110%); }
          to   { transform: translateX(0); }
        }
        @keyframes noz-slide-out {
          from { transform: translateX(0); }
          to   { transform: translateX(-130%); } /* fully gone */
        }

        .noz-enter {
          animation: noz-slide-in 0.6s ease forwards;
        }
        .noz-hold {
          transform: translateX(0);
        }
        .noz-exit {
          animation: noz-slide-out 0.5s ease forwards;
        }

        .noz-text {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.03em;
          color: #1a1a1a;
          white-space: nowrap;
          display: inline-block;
        }
      `}</style>

      {/* ✅ Only ONE element rendered → no overlap */}
      <span key={index} className={`noz-text noz-${phase}`}>
        {messages[index]}
      </span>
    </div>
  );
}
