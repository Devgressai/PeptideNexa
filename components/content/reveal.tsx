"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "aside";
};

/**
 * Restrained scroll-triggered fade. Shows exactly once, 220ms ease-out,
 * 6px translate. Respects prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={cn(className)}>{children}</div>;
  }

  const MotionTag = motion[as];
  return (
    <MotionTag
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "-64px" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
