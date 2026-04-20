import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Internal portal",
  description: "PeptideNexa internal administration portal.",
  path: "/admin",
  noIndex: true,
});

// This page exists so /admin returns a branded surface instead of a bare 404.
// The full admin experience (content editing, lead management, on-demand
// revalidation, analytics) is authentication-gated and will live behind
// middleware once the provider/admin auth scaffolding lands.

export default function AdminLandingPage() {
  return (
    <Container className="py-28 md:py-36">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Internal portal</p>
        <h1 className="mt-4 font-serif text-display-lg text-ink-strong text-balance">
          This area is editorial-only.
        </h1>
        <p className="mx-auto mt-5 max-w-readable leading-relaxed text-ink-muted">
          The admin workspace for content editing, provider verification, and lead routing lives
          behind authenticated access. If you&rsquo;re on the editorial team, sign in from the
          onboarding email you received. Otherwise, head back to the public site.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="brand">
            <Link href="/">Back to site</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/methodology">Read our methodology</Link>
          </Button>
        </div>
        <p className="mt-10 text-xs text-ink-subtle">
          Need access?{" "}
          <Link
            href="/editorial-policy"
            className="underline decoration-ink-subtle underline-offset-[3px] hover:text-ink-strong"
          >
            Contact editorial
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
