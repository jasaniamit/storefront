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
  { text: "2ml Samples Available", href: "/c/categories/2ml-samples" },
  { text: "All Products are IFRA Compliant" },
  { text: "Contact our Support Service", href: "/contact" },
  { text: "Check Out Our New Release", href: "/c/categories/new-arrivals" },
];

const AUTO_ROTATE_MS = 3500;
const TRANSITION_MS = 500;

const N = messages.length;

// Build an "extended" strip: [clone of last, ...real messages, clone of first].
// This lets the carousel keep sliding smoothly past either end instead of
// snapping backward across the whole strip when it wraps around.
const extended: AnnouncementItem[] = [messages[N - 1], ...messages, messages[0]];
const SLIDE_COUNT = extended.length; // N + 2

export function AnnouncementBar() {
  // `position` indexes into `extended`. Real messages live at positions 1..N.
  // Position 0 is the clone of the last message; position N+1 is the clone
  // of the first message.
  const [position, setPosition] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goNext = useCallback(() => {
    setPosition((p) => p + 1);
  }, []);

  const goPrev = useCallback(() => {
    setPosition((p) => p - 1);
  }, []);

  // After the strip animates onto a clone slide, silently (no transition)
  // snap it to the matching real slide once the animation has finished.
  useEffect(() => {
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);

    if (position === SLIDE_COUNT - 1 || position === 0) {
      snapTimeoutRef.current = setTimeout(() => {
        setWithTransition(false);
        setPosition(position === SLIDE_COUNT - 1 ? 1 : N);
      }, TRANSITION_MS);
    }

    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, [position]);

  // Re-enable the transition on the frame right after a silent snap, so the
  // *next* real step animates normally again.
  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => setWithTransition(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  // Auto-rotate, resetting the timer whenever position changes (including
  // manual clicks), so manually navigating doesn't fight with the interval.
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, AUTO_ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [position, goNext]);

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
            flexDirection: "column",
            width: "100%",
            height: `${SLIDE_COUNT * 100}%`,
            transform: `translateY(-${position * (100 / SLIDE_COUNT)}%)`,
            transition: withTransition ? `transform ${TRANSITION_MS}ms ease` : "none",
          }}
        >
          {extended.map((item, i) => {
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
                  width: "100%",
                  height: `${100 / SLIDE_COUNT}%`,
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
