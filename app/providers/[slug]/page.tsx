import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, ExternalLink } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/forms/lead-form";
import { LastUpdatedStamp } from "@/components/content/last-updated-stamp";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, providerSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getListedProviderSlugs,
  getProviderBySlug,
} from "@/lib/db/loaders/provider";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getListedProviderSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) {
    return buildMetadata({
      title: "Provider not found",
      description: "",
      path: `/providers/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${provider.name} — Review & profile`,
    description: provider.shortDescription,
    path: `/providers/${provider.slug}`,
  });
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Providers", href: "/providers" },
              { label: provider.name },
            ]}
          />
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="muted">
                  {provider.type === "ONLINE"
                    ? "Online provider"
                    : provider.type === "CLINIC"
                      ? "Clinic"
                      : "Compounding pharmacy"}
                </Badge>
                {provider.featured ? <Badge variant="signal">Featured</Badge> : null}
                {provider.verified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-success">
                    <ShieldCheck aria-hidden className="h-3.5 w-3.5" />
                    Verified
                  </span>
                ) : null}
              </div>
              <h1 className="mt-3 font-serif text-display-lg text-ink">{provider.name}</h1>
              <p className="mt-3 max-w-readable text-ink-muted">{provider.shortDescription}</p>
              <LastUpdatedStamp date={provider.lastVerifiedAt} label="Last verified" />
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row">
              <Button asChild size="lg">
                <a
                  href={provider.affiliateUrl ?? provider.websiteUrl}
                  rel="sponsored nofollow noopener"
                  target="_blank"
                >
                  Visit site
                  <ExternalLink aria-hidden className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#contact">Contact provider</Link>
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="prose-editorial max-w-prose">
            <h2>Editorial note</h2>
            <p>
              {provider.editorialNote ??
                "Our team reviews providers for public information, licensing posture, and clarity of service. This is an independent assessment — not a medical recommendation."}
            </p>
            <h2>About {provider.name}</h2>
            <p>
              {provider.bodyMdx ??
                "Extended editorial overview will appear here once the provider body is populated."}
            </p>
            <h2>Peptides referenced</h2>
            <p>
              {provider.peptideSlugs.length > 0
                ? `This provider works with or references: ${provider.peptideSlugs.join(", ")}.`
                : "No specific peptides are listed for this provider yet."}
            </p>
          </article>

          <aside id="contact" className="space-y-6">
            <div className="rounded-lg border border-line bg-paper-raised p-6">
              <h2 className="font-serif text-xl text-ink">Request information</h2>
              <p className="mt-1 text-sm text-ink-muted">
                We&rsquo;ll pass your details to {provider.name} and follow up with alternatives if
                needed.
              </p>
              <div className="mt-5">
                <LeadForm source={`provider:${provider.slug}`} compact />
              </div>
            </div>
            <p className="text-xs text-ink-subtle">
              Links to {provider.name} may be affiliate links. We only feature providers we have
              reviewed.
            </p>
          </aside>
        </div>
      </Container>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Providers", path: "/providers" },
          { name: provider.name, path: `/providers/${provider.slug}` },
        ])}
      />
      <JsonLd
        data={providerSchema({
          name: provider.name,
          path: `/providers/${provider.slug}`,
          description: provider.shortDescription,
          websiteUrl: provider.websiteUrl,
          city: provider.city,
          state: provider.state,
        })}
      />
    </>
  );
}

