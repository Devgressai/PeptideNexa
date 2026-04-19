import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="text-xs uppercase tracking-wider text-ink-subtle">404</p>
      <h1 className="mt-4 font-serif text-display-lg text-ink">Page not found</h1>
      <p className="mx-auto mt-4 max-w-readable text-ink-muted">
        The page you&rsquo;re looking for moved or never existed. Try one of these instead.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/peptides">Browse peptides</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/providers">Browse providers</Link>
        </Button>
      </div>
    </Container>
  );
}
