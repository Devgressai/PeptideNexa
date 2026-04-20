import Link from "next/link";
import type { Route } from "next";
import { Container } from "./container";
import { NavLink } from "./nav-link";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";

const primaryNav: Array<{ label: string; href: Route }> = [
  { label: "Peptides", href: "/peptides" },
  { label: "Providers", href: "/providers" },
  { label: "Compare", href: "/compare" },
  { label: "Guides", href: "/guides" },
  { label: "For providers", href: "/for-providers" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
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
          <span className="font-serif text-lg tracking-tight text-ink">PeptideNexa</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {primaryNav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
            <Link href="/search">Search</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/match">Find a provider</Link>
          </Button>
          <MobileNav items={primaryNav} />
        </div>
      </Container>
    </header>
  );
}
