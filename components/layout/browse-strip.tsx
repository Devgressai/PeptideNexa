import Link from "next/link";
import type { Route } from "next";
import { Container } from "./container";

// Popular peptide shortcut row, inspired by WebMD's Health A–Z strip. Scrolls
// away with the page (not sticky) so it doesn't compete with the main nav for
// vertical real estate once the reader is deep in content.

const POPULAR: Array<{ label: string; href: string }> = [
  { label: "BPC-157", href: "/peptides/bpc-157" },
  { label: "TB-500", href: "/peptides/tb-500" },
  { label: "Semaglutide", href: "/peptides/semaglutide" },
  { label: "Tirzepatide", href: "/peptides/tirzepatide" },
  { label: "Ipamorelin", href: "/peptides/ipamorelin" },
  { label: "CJC-1295", href: "/peptides/cjc-1295" },
  { label: "GHK-Cu", href: "/peptides/ghk-cu" },
  { label: "Epitalon", href: "/peptides/epitalon" },
];

export function BrowseStrip() {
  return (
    <div
      role="complementary"
      aria-label="Popular peptides"
      className="hidden border-b border-line bg-paper md:block"
    >
      <Container className="flex h-11 items-center gap-4 overflow-hidden text-[13px]">
        <span className="eyebrow shrink-0">Browse</span>
        <nav
          aria-label="Popular peptides"
          className="flex min-w-0 flex-1 items-center gap-x-4 gap-y-0 overflow-x-auto"
        >
          {POPULAR.map((item, i) => (
            <div key={item.href} className="flex shrink-0 items-center gap-4">
              <Link
                href={item.href as Route}
                className="shrink-0 whitespace-nowrap font-medium text-ink-muted transition-colors duration-sm hover:text-brand focus-ring rounded-sm"
              >
                {item.label}
              </Link>
              {i < POPULAR.length - 1 ? (
                <span aria-hidden className="text-line-strong">
                  ·
                </span>
              ) : null}
            </div>
          ))}
        </nav>
        <Link
          href="/peptides"
          className="ml-auto shrink-0 whitespace-nowrap text-[12px] font-medium text-ink-strong transition-colors duration-sm hover:text-brand focus-ring rounded-sm"
        >
          A–Z library →
        </Link>
      </Container>
    </div>
  );
}
