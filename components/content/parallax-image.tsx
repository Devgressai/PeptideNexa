"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type ParallaxImageProps = Omit<ImageProps, "className"> & {
  className?: string;
  wrapperClassName?: string;
  intensity?: number; // translateY in px over the full scroll range
};

/**
 * Scroll-linked parallax. As the wrapper passes through the viewport, the
 * contained image shifts vertically within its overflow container. Gives
 * the hero that "alive" feel without heavy motion. Reduced-motion users
 * get a static image.
 */
export function ParallaxImage({
  className,
  wrapperClassName,
  intensity = 40,
  alt,
  ...imageProps
}: ParallaxImageProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      if (!wrapper || !inner) return;
      const rect = wrapper.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewport) return; // off-screen, skip
      // Progress from -1 (below viewport) to +1 (above viewport).
      const progress = (viewport / 2 - (rect.top + rect.height / 2)) / (viewport / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      inner.style.transform = `translate3d(0, ${clamped * intensity}px, 0)`;
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
  }, [intensity]);

  return (
    <div ref={wrapperRef} className={cn("relative overflow-hidden", wrapperClassName)}>
      <div
        ref={innerRef}
        className="absolute inset-0 will-change-transform"
        style={{ top: `-${Math.ceil(intensity)}px`, bottom: `-${Math.ceil(intensity)}px` }}
      >
        <Image {...imageProps} alt={alt} fill className={cn("object-cover", className)} />
      </div>
    </div>
  );
}
