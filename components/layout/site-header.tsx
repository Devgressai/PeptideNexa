"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { Container } from "./container";
import { NavLink } from "./nav-link";
import { MobileNav } from "./mobile-nav";
import { UtilityBar } from "./utility-bar";
import { BrowseStrip } from "./browse-strip";
import { MegaMenuPanel, type MegaMenuKey } from "./mega-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavEntry =
  | { kind: "link"; label: string; href: Route }
  | { kind: "menu"; label: string; key: MegaMenuKey };

const primaryNav: NavEntry[] = [
  { kind: "menu", label: "Peptides", key: "peptides" },
  { kind: "menu", label: "Providers", key: "providers" },
  { kind: "link", label: "Compare", href: "/compare" },
  { kind: "link", label: "Guides", href: "/guides" },
  { kind: "link", label: "Methodology", href: "/methodology" },
];

const mobileNavItems: Array<{ label: string; href: Route }> = [
  { label: "Peptides", href: "/peptides" },
  { label: "Providers", href: "/providers" },
  { label: "Compare", href: "/compare" },
  { label: "Guides", href: "/guides" },
  { label: "Methodology", href: "/methodology" },
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "For providers", href: "/for-providers" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<MegaMenuKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  // Close on route change.
  useEffect(() => {
    setOpenMenu(null);
    clearCloseTimer();
  }, [pathname]);

  // Escape closes.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  return (
    <>
      <UtilityBar />
      <BrowseStrip />
      <header
        className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md"
        onMouseLeave={scheduleClose}
      >
        <Container className="flex h-[72px] items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-sm transition-opacity duration-sm hover:opacity-80 focus-ring"
            aria-label="PeptideNexa home"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-6 w-6 text-brand"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="7" cy="8" r="2" fill="currentColor" />
              <circle cx="17" cy="16" r="2" fill="currentColor" />
              <circle cx="7" cy="16" r="1.5" />
              <circle cx="17" cy="8" r="1.5" />
              <line x1="7" y1="8" x2="17" y2="8" />
              <line x1="7" y1="16" x2="17" y2="16" />
              <line x1="7" y1="8" x2="17" y2="16" />
            </svg>
            <span className="font-serif text-lg tracking-tight text-ink-strong">PeptideNexa</span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 md:flex"
            onMouseEnter={clearCloseTimer}
          >
            {primaryNav.map((item) => {
              if (item.kind === "link") {
                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    className="rounded-sm px-3 py-2 text-[0.9rem] hover:bg-paper-sunken/60"
                  />
                );
              }
              const isOpen = openMenu === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onMouseEnter={() => {
                    clearCloseTimer();
                    setOpenMenu(item.key);
                  }}
                  onFocus={() => setOpenMenu(item.key)}
                  onClick={() =>
                    setOpenMenu((prev) => (prev === item.key ? null : item.key))
                  }
                  className={cn(
                    "inline-flex items-center gap-1 rounded-sm px-3 py-2 text-[0.9rem] transition-colors duration-sm focus-ring",
                    isOpen
                      ? "bg-paper-sunken/60 text-ink-strong"
                      : "text-ink-muted hover:bg-paper-sunken/60 hover:text-ink",
                  )}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-xs",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Inline search on lg+; search icon only below that. */}
            <form
              role="search"
              action="/search"
              method="get"
              className="hidden lg:block"
            >
              <label htmlFor="nav-search" className="sr-only">
                Search PeptideNexa
              </label>
              <div className="relative">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-subtle"
                />
                <input
                  id="nav-search"
                  name="q"
                  type="search"
                  placeholder="Search peptides, providers…"
                  autoComplete="off"
                  className="h-9 w-[220px] rounded-sm border border-line bg-paper-sunken/60 pl-8 pr-3 text-[13px] text-ink placeholder:text-ink-subtle transition-colors duration-sm hover:border-line-strong focus-visible:border-brand focus-visible:bg-paper-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-paper"
                />
              </div>
            </form>
            <Link
              href="/search"
              aria-label="Search"
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors duration-sm hover:bg-paper-sunken hover:text-ink-strong focus-ring lg:hidden"
            >
              <Search aria-hidden className="h-4 w-4" />
            </Link>
            <Button asChild size="sm" variant="brand" className="hidden md:inline-flex">
              <Link href="/match">Find a match</Link>
            </Button>
            <MobileNav items={mobileNavItems} />
          </div>
        </Container>

        <MegaMenuPanel
          openKey={openMenu}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
          onClose={() => setOpenMenu(null)}
        />
      </header>
    </>
  );
}
