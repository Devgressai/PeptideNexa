import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/forms/lead-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "For providers — get listed on PeptideNexa",
  description:
    "Reach qualified, pre-educated demand. Featured listings, direct lead routing, and category partnerships for credible peptide providers.",
  path: "/for-providers",
});

export default function ForProvidersPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "For providers" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">For providers</h1>
          <p className="mt-3 max-w-readable text-ink-muted">
            We send pre-educated, motivated demand to credible providers. Free directory listings,
            paid featured placements, and direct CPL partnerships for top partners.
          </p>
        </Container>
      </header>
      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
          <article className="prose-editorial max-w-prose">
            <h2>What we offer</h2>
            <ul>
              <li>Verified directory listing with enhanced profile fields.</li>
              <li>Featured placement across relevant peptide and location pages.</li>
              <li>Direct lead routing via our matching quiz, with clear acceptance SLAs.</li>
              <li>Monthly performance reporting and a dedicated partner contact.</li>
            </ul>
            <h2>Who we work with</h2>
            <p>
              Licensed telehealth platforms, in-person clinics, and compounding pharmacies operating
              in the United States with a clean compliance posture. We curate — we do not accept
              every applicant.
            </p>
          </article>
          <aside>
            <div className="rounded-lg border border-line bg-paper-raised p-6">
              <h2 className="font-serif text-xl text-ink">Apply to be listed</h2>
              <LeadForm source="for-providers" compact />
              <Button asChild variant="link" className="mt-3 px-0">
                <a href="mailto:partners@peptidenexa.com">Or email our partnerships team →</a>
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
