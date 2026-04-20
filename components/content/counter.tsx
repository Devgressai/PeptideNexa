"use client";

import * as React from "react";

type CounterProps = {
  value: number;
  duration?: number; // ms
  suffix?: string;
  prefix?: string;
  className?: string;
  format?: (n: number) => string;
};

/**
 * Counts from 0 to value once when the element scrolls into view. Uses
 * requestAnimationFrame for a smooth ease-out tick, and respects
 * prefers-reduced-motion by skipping straight to the final value.
 */
export function Counter({
  value,
  duration = 1200,
  suffix = "",
  prefix = "",
  className,
  format,
}: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let started = false;
    let frame = 0;

    const animate = (start: number) => {
      const step = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(value * eased));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            animate(performance.now());
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  const shown = format ? format(display) : display.toLocaleString();
  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
