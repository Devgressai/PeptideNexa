import Link from "next/link";
import type { Route } from "next";
import { Container } from "./container";
import { NavLink } from "./nav-link";
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
        <Link href="/" className="flex items-center gap-2" aria-label="PeptideNexa home">
          <span aria-hidden className="h-6 w-6 rounded-sm bg-brand" />
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
          <Button asChild size="sm">
            <Link href="/match">Find a provider</Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
