"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  max?: number; // maximum tilt in degrees
};

/**
 * Pointer-tracked 3D tilt with specular light sweep. Kept subtle — max 4°
 * rotation, 0.25s settle — so it feels premium, not arcade. Skipped on
 * touch and reduced-motion devices.
 */
export function TiltCard({ children, className, max = 4 }: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) return;

    let frame = 0;
    const write = (rx: number, ry: number, px: number, py: number) => {
      el.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      el.style.setProperty("--tilt-x", `${px.toFixed(1)}%`);
      el.style.setProperty("--tilt-y", `${py.toFixed(1)}%`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const xPct = (event.clientX - rect.left) / rect.width; // 0..1
      const yPct = (event.clientY - rect.top) / rect.height;
      const rotY = (xPct - 0.5) * 2 * max;
      const rotX = (0.5 - yPct) * 2 * max;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => write(rotX, rotY, xPct * 100, yPct * 100));
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => write(0, 0, 50, 50));
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [max]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative transition-transform duration-250 ease-out will-change-transform",
        className,
      )}
      style={{
        transformStyle: "preserve-3d",
        // Initial specular sweep anchor — re-written by pointermove.
        // Consumed by a child overlay that renders a soft light beam.
        ["--tilt-x" as unknown as string]: "50%",
        ["--tilt-y" as unknown as string]: "50%",
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
