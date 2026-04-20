import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">404 · Not found</p>
        <h1 className="mt-4 font-serif text-display-lg text-ink-strong text-balance">
          We couldn&rsquo;t find that page.
        </h1>
        <p className="mx-auto mt-5 max-w-readable text-ink-muted">
          The page may have moved, been renamed, or never existed. Try searching, or start from
          one of the places below.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="brand">
            <Link href="/search">Search the site</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/peptides">Browse peptides</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/providers">Browse providers</Link>
          </Button>
        </div>
        <p className="mt-10 text-xs text-ink-subtle">
          Think this is a broken link on our side?{" "}
          <Link
            href="/editorial-policy"
            className="underline decoration-ink-subtle underline-offset-[3px] hover:text-ink-strong"
          >
            Report a correction
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
