"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: Route };

type MobileNavProps = {
  items: NavItem[];
};

/**
 * Mobile primary nav. Overlay + slide-in drawer pattern. Traps focus,
 * closes on route change, closes on Escape, restores scroll.
 */
export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close on route change.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open; release on close.
  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <X aria-hidden className="h-5 w-5" />
        ) : (
          <Menu aria-hidden className="h-5 w-5" />
        )}
      </Button>

      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Panel */}
        <nav
          aria-label="Mobile primary"
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper-raised shadow-e4 transition-transform duration-250 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-6">
            <span className="eyebrow">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors duration-sm hover:bg-paper-sunken hover:text-ink-strong focus-ring"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>

          <ul className="flex-1 overflow-y-auto px-2 py-4">
            {items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-sm px-4 py-3 font-serif text-xl transition-colors duration-sm focus-ring",
                      isActive
                        ? "bg-paper-sunken text-ink-strong"
                        : "text-ink-muted hover:bg-paper-sunken hover:text-ink-strong",
                    )}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-line p-6">
            <Button asChild variant="brand" className="w-full" size="lg">
              <Link href="/match">Find a match</Link>
            </Button>
            <Button asChild variant="secondary" className="mt-2 w-full" size="lg">
              <Link href="/search">Search</Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
