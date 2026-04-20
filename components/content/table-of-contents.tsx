"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { MdxHeading } from "@/lib/content/mdx-headings";

type TableOfContentsProps = {
  items: MdxHeading[];
  className?: string;
};

/**
 * Sticky, in-body Table of Contents. Highlights the current section via
 * IntersectionObserver against the rendered heading anchors.
 *
 * Peter Attia / Stripe Docs pattern: left rail on desktop, collapses below
 * the lede on mobile via the consuming layout.
 */
export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string | null>(
    items.length > 0 ? (items[0]?.id ?? null) : null,
  );

  React.useEffect(() => {
    if (items.length === 0) return;

    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Of the currently-visible headings, pick the topmost.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0]!.target.id);
        }
      },
      {
        // Anchor "current" to roughly the top-third of the viewport.
        rootMargin: "-80px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className={cn("text-sm", className)}>
      <p className="eyebrow">On this page</p>
      <ol className="mt-4 space-y-1 border-l border-line">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "-ml-px flex border-l border-transparent py-1.5 pl-4 pr-2 leading-snug transition-colors duration-sm focus-ring rounded-sm",
                  item.level === 3 && "pl-7",
                  isActive
                    ? "border-brand font-medium text-ink-strong"
                    : "text-ink-muted hover:text-ink-strong",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
