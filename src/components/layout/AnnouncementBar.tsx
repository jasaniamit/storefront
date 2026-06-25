"use client";

import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type AnnouncementItem = {
  text: string;
  href?: string;
};

// 5 rotating messages. Items with `href` render as clickable links with an
// arrow icon (matching the reference site's "Buy Any 2 at 799 →" style).
const messages: AnnouncementItem[] = [
  { text: "Free Shipping On Order Above ₹999/-" },
  { text: "2ml Samples Available · Try Before You Buy", href: "/c/categories/2ml-samples" },
  { text: "All Products are IFRA Compliant" },
  { text: "Get Our Support", href: "/contact" },
  { text: "Check Out Our New Release", href: "/c/categories/new-arrivals" },
];

const AUTO_ROTATE_MS = 3500;
const TRANSITION_MS = 500;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => {
    setIndex(((next % messages.length) + messages.length) % messages.length);
  }, []);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-rotate, resetting the timer whenever the index changes (including
  // manual clicks), so manually navigating doesn't fight with the interval.
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, AUTO_ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [index]);

  return (
    <div
      style={{
        backgroundColor: "#f5f5f4",
        borderBottom: "1px solid #e5e5e5",
        height: "36px",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous announcement"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 10px",
          height: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#000",
          flexShrink: 0,
        }}
      >
        <ChevronLeft size={22} strokeWidth={2} />
      </button>

      <div
        style={{
          flex: 1,
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "100%",
            width: `${messages.length * 100}%`,
            transform: `translateX(-${index * (100 / messages.length)}%)`,
            transition: `transform ${TRANSITION_MS}ms ease`,
          }}
        >
          {messages.map((item, i) => {
            const content = (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "14px",
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                  color: "#000",
                  whiteSpace: "nowrap",
                }}
              >
                {item.text}
                {item.href && <ArrowRight size={15} strokeWidth={2} />}
              </span>
            );

            return (
              <div
                key={i}
                style={{
                  width: `${100 / messages.length}%`,
                  height: "100%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.href ? (
                  <Link href={item.href} style={{ textDecoration: "none" }}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={goNext}
        aria-label="Next announcement"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 10px",
          height: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#000",
          flexShrink: 0,
        }}
      >
        <ChevronRight size={22} strokeWidth={2} />
      </button>
    </div>
  );
}
