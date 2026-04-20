"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "./container";
import { cn } from "@/lib/utils";

export type MegaMenuKey = "peptides" | "providers";

type Column = {
  heading: string;
  links: Array<{ label: string; href: string }>;
};

type FeaturePanel = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  image?: string;
};

type MenuContent = {
  id: MegaMenuKey;
  columns: Column[];
  feature: FeaturePanel;
};

const peptidesMenu: MenuContent = {
  id: "peptides",
  columns: [
    {
      heading: "By category",
      links: [
        { label: "Healing & repair", href: "/peptides/categories/healing-repair" },
        { label: "Growth hormone secretagogues", href: "/peptides/categories/ghs" },
        { label: "Metabolic", href: "/peptides/categories/metabolic" },
        { label: "Cognitive", href: "/peptides/categories/cognitive" },
        { label: "Longevity", href: "/peptides/categories/longevity" },
        { label: "Immune & inflammation", href: "/peptides/categories/immune" },
      ],
    },
    {
      heading: "By research goal",
      links: [
        { label: "Tissue repair", href: "/peptides?goal=tissue-repair" },
        { label: "Body composition", href: "/peptides?goal=body-composition" },
        { label: "Sleep quality", href: "/peptides?goal=sleep" },
        { label: "Cognition", href: "/peptides?goal=cognition" },
        { label: "Skin & hair", href: "/peptides?goal=skin-hair" },
        { label: "Longevity", href: "/peptides?goal=longevity" },
      ],
    },
    {
      heading: "By evidence level",
      links: [
        { label: "Strong clinical evidence", href: "/peptides?evidence=strong" },
        { label: "Moderate clinical evidence", href: "/peptides?evidence=moderate" },
        { label: "Emerging / preclinical", href: "/peptides?evidence=emerging" },
        { label: "View evidence methodology", href: "/methodology" },
      ],
    },
  ],
  feature: {
    eyebrow: "Editorial",
    title: "A calm guide to peptide research",
    body: "How to evaluate mechanism, the evidence ladder, and a credible provider — without the hype.",
    href: "/guides/calm-guide-to-peptide-research",
    image: "/generated/editorial-spotlight.png",
  },
};

const providersMenu: MenuContent = {
  id: "providers",
  columns: [
    {
      heading: "By type",
      links: [
        { label: "Online clinics", href: "/providers?type=online" },
        { label: "In-person clinics", href: "/providers?type=clinic" },
        { label: "Compounding pharmacies", href: "/providers?type=compounding" },
        { label: "See all providers", href: "/providers" },
      ],
    },
    {
      heading: "By state",
      links: [
        { label: "California", href: "/providers?state=CA" },
        { label: "Florida", href: "/providers?state=FL" },
        { label: "Texas", href: "/providers?state=TX" },
        { label: "New York", href: "/providers?state=NY" },
        { label: "Arizona", href: "/providers?state=AZ" },
        { label: "See all states", href: "/providers" },
      ],
    },
    {
      heading: "By focus",
      links: [
        { label: "Hormone optimization", href: "/providers?focus=hormone" },
        { label: "Recovery & longevity", href: "/providers?focus=longevity" },
        { label: "Metabolic health", href: "/providers?focus=metabolic" },
        { label: "Cognitive", href: "/providers?focus=cognitive" },
      ],
    },
  ],
  feature: {
    eyebrow: "Trust",
    title: "How we verify providers",
    body: "License checks, state coverage, pricing transparency, compounding source — our editorial review, in detail.",
    href: "/methodology",
    image: "/generated/lifestyle-consult.png",
  },
};

const menus: Record<MegaMenuKey, MenuContent> = {
  peptides: peptidesMenu,
  providers: providersMenu,
};

type PanelProps = {
  openKey: MegaMenuKey | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
};

/**
 * Shared dropdown panel for the primary nav. One panel instance swaps its
 * content based on openKey to keep motion smooth and layout stable.
 *
 * Always rendered so the fade transition works; `inert` disables keyboard
 * focus when closed, and `pointer-events-none` suppresses mouse when closed.
 */
export function MegaMenuPanel({ openKey, onMouseEnter, onMouseLeave, onClose }: PanelProps) {
  const isOpen = openKey !== null;
  const menu = openKey ? menus[openKey] : menus.peptides;
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Keyboard navigation: arrow keys move between focusable links inside the
  // panel, Home/End jump to first/last, Escape bubbles up to the header.
  const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const items = Array.from(
      panelRef.current.querySelectorAll<HTMLAnchorElement>("a[href]"),
    );
    if (items.length === 0) return;
    const currentIdx = items.indexOf(document.activeElement as HTMLAnchorElement);

    const focus = (idx: number) => {
      event.preventDefault();
      items[(idx + items.length) % items.length]?.focus();
    };

    if (event.key === "ArrowDown" || event.key === "ArrowRight") focus(currentIdx + 1);
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") focus(currentIdx - 1);
    else if (event.key === "Home") focus(0);
    else if (event.key === "End") focus(items.length - 1);
  }, []);

  return (
    <div
      ref={panelRef}
      aria-hidden={!isOpen}
      inert={!isOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      className={cn(
        "absolute inset-x-0 top-full z-40 border-b border-line bg-paper-raised shadow-e3",
        "transition-[opacity,transform] duration-sm ease-standard",
        isOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      <Container>
        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_1fr_1fr_1.1fr] lg:gap-12">
          {menu.columns.map((col) => (
            <div key={col.heading}>
              <p className="eyebrow">{col.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={`${col.heading}-${link.label}`}>
                    <Link
                      href={link.href as Route}
                      onClick={onClose}
                      className="group inline-flex items-center gap-1.5 text-[0.9375rem] text-ink-muted transition-colors duration-sm hover:text-ink-strong focus-ring rounded-sm"
                    >
                      <span>{link.label}</span>
                      <ArrowRight
                        aria-hidden
                        className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-xs group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <Link
            href={menu.feature.href as Route}
            onClick={onClose}
            className="group relative overflow-hidden rounded-md border border-line bg-paper transition-all duration-sm hover:border-line-strong hover:shadow-e2 focus-ring"
          >
            {menu.feature.image && (
              <div className="relative aspect-[16/10] overflow-hidden bg-paper-sunken">
                <Image
                  src={menu.feature.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="object-cover transition-transform duration-lg ease-standard group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent"
                />
              </div>
            )}
            <div className="p-5">
              <p className="eyebrow">{menu.feature.eyebrow}</p>
              <p className="mt-2 font-serif text-lg leading-snug text-ink-strong">
                {menu.feature.title}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{menu.feature.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                Read more
                <ArrowRight
                  aria-hidden
                  className="h-3.5 w-3.5 transition-transform duration-sm group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </Link>
        </div>
      </Container>
    </div>
  );
}
