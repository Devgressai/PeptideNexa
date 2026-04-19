import Link from "next/link";
import { Container } from "./container";
import { Button } from "@/components/ui/button";

const primaryNav = [
  { label: "Peptides", href: "/peptides" as const },
  { label: "Providers", href: "/providers" as const },
  { label: "Compare", href: "/compare" as const },
  { label: "Guides", href: "/guides" as const },
  { label: "For providers", href: "/for-providers" as const },
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
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
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
