"use client";

import { useEffect, useState } from "react";

const messages = [
  "Free Shipping On Order Above ₹999/-",
  "Premium-Quality Fragrances · No Excessive Markups",
  "Proud to be an Indian Brand 🇮🇳",
  "2ml Samples Available · Try Before You Buy",
];

/**
 * AnnouncementBar
 * ---------------
 * Sequential ticker: each message slides in from the RIGHT,
 * holds for a moment, then exits to the LEFT.
 * Next message enters from the RIGHT. Loops continuously.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  // phase: "enter" → slides in from right
  //        "hold"  → visible and still
  //        "exit"  → slides out to left
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "enter") {
      // After slide-in (0.6s), switch to hold
      timer = setTimeout(() => setPhase("hold"), 600);
    } else if (phase === "hold") {
      // Hold for 3s then exit
      timer = setTimeout(() => setPhase("exit"), 3000);
    } else if (phase === "exit") {
      // After slide-out (0.5s), advance to next message and re-enter
      timer = setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setPhase("enter");
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  // Transform based on phase
  const transform =
    phase === "enter"
      ? "translateX(0)"
      : phase === "hold"
        ? "translateX(0)"
        : "translateX(-110%)";

  const initialTransform =
    phase === "enter" ? "translateX(110%)" : undefined;

  // We use a key on the span so it remounts (resets) on each new message
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #ebebeb",
        height: "36px",
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
          to   { transform: translateX(-110%); }
        }
        .noz-ticker-enter {
          animation: noz-slide-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .noz-ticker-hold {
          transform: translateX(0);
        }
        .noz-ticker-exit {
          animation: noz-slide-out 0.5s cubic-bezier(0.55, 0, 0.1, 1) forwards;
        }
        .noz-ticker-text {
          font-size: 16px;
          font-weight: 300;
          letter-spacing: 0.04em;
          color: #1a1a1a;
          white-space: nowrap;
          font-family: inherit;
          display: inline-block;
          will-change: transform;
        }
      `}</style>

      <span
        key={`${index}-${phase}`}
        className={`noz-ticker-text noz-ticker-${phase}`}
      >
        {messages[index]}
      </span>
    </div>
  );
}
