"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: React.ReactNode;
  strength?: number; // 0.1 - 0.5, how far the element follows the cursor
  className?: string;
};

/**
 * Linear / Vercel-style magnetic hover. On pointer move within the element,
 * the child translates slightly toward the cursor. Skipped entirely on
 * touch / reduced-motion devices. Pure transform, no layout shift.
 */
export function Magnetic({ children, strength = 0.25, className }: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !pointerFine) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = "translate3d(0, 0, 0)";
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={cn("inline-block transition-transform duration-200 ease-out", className)}
      style={{ transform: "translate3d(0, 0, 0)" }}
    >
      {children}
    </div>
  );
}
