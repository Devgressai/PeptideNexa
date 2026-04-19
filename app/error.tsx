"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Wire to Sentry/OTel here once observability is installed.
    console.error("[app-error]", error);
  }, [error]);

  return (
    <Container className="py-32 text-center">
      <p className="text-xs uppercase tracking-wider text-ink-subtle">Something went wrong</p>
      <h1 className="mt-4 font-serif text-display-md text-ink">We hit an unexpected error.</h1>
      <p className="mx-auto mt-4 max-w-readable text-ink-muted">
        Our team has been notified. You can try again, or head back to the homepage.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="secondary">
          <Link href="/">Homepage</Link>
        </Button>
      </div>
    </Container>
  );
}
