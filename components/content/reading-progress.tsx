"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ReadingProgressProps = {
  className?: string;
};

/**
 * Thin progress bar pinned below the site header. Shows how far through the
 * main article the reader has scrolled. Pure layout math — listens to a
 * single passive scroll event and writes a transform.
 */
export function ReadingProgress({ className }: ReadingProgressProps) {
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;
      const rect = main.getBoundingClientRect();
      const viewport = window.innerHeight;
      // How much of main has scrolled *past* the top of the viewport, as a
      // fraction of (main height - viewport height). Clamped 0..1.
      const total = Math.max(1, rect.height - viewport);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      bar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-16 z-30 h-0.5 origin-left bg-transparent",
        className,
      )}
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-brand transition-transform duration-150 ease-out"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
