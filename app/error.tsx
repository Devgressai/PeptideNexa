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
    <Container className="py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow text-danger">Unexpected error</p>
        <h1 className="mt-4 font-serif text-display-md text-ink-strong text-balance">
          Something went wrong on our side.
        </h1>
        <p className="mx-auto mt-5 max-w-readable text-ink-muted">
          Our team has been notified. You can retry, head back to the homepage, or reach out if
          the issue persists.
        </p>
        {error.digest ? (
          <p className="mx-auto mt-6 inline-block rounded-sm border border-line bg-paper-sunken px-3 py-1.5 font-mono text-xs text-ink-subtle">
            Reference · {error.digest}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} size="lg" variant="brand">
            Try again
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/">Homepage</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
