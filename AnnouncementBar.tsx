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
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "hidden">("enter");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "enter") {
      timer = setTimeout(() => setPhase("hold"), 600);
    } else if (phase === "hold") {
      timer = setTimeout(() => setPhase("exit"), 2500);
    } else if (phase === "exit") {
      // 🔥 wait for exit animation, then hide completely
      timer = setTimeout(() => setPhase("hidden"), 500);
    } else if (phase === "hidden") {
      // 🔥 now switch text AFTER it's gone
      timer = setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setPhase("enter");
      }, 100);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div
      style={{
        backgroundColor: "#f5f5f4", // ✅ FIXED
        borderBottom: "1px solid #e5e5e5",
        height: "32px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(110%); }
          to   { transform: translateX(0); }
        }

        @keyframes slideOut {
          from { transform: translateX(0); }
          to   { transform: translateX(-130%); }
        }

        .text {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.03em;
          color: #000;
          white-space: nowrap;
        }

        .enter {
          animation: slideIn 0.6s ease;
        }

        .hold {
          transform: translateX(0);
        }

        .exit {
          animation: slideOut 0.5s ease;
        }
      `}</style>

      {/* 🔥 KEY FIX: unmount when hidden */}
      {phase !== "hidden" && (
        <span key={index} className={`text ${phase}`}>
          {messages[index]}
        </span>
      )}
    </div>
  );
}
