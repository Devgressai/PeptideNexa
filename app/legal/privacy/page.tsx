import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy policy",
  description: "How PeptideNexa collects, uses, and safeguards personal information.",
  path: "/legal/privacy",
});

// Placeholder — requires counsel review before production.
export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Legal" },
              { label: "Privacy policy" },
            ]}
          />
          <h1 className="mt-4 font-serif text-display-lg text-ink">Privacy policy</h1>
        </Container>
      </header>
      <Container className="py-12">
        <article className="prose-editorial max-w-prose">
          <p>
            <em>This page is pending counsel review. The version below is a placeholder and is not
            legally binding until finalized.</em>
          </p>
          <h2>What we collect</h2>
          <p>
            When you submit a matching request or newsletter subscription, we collect the contact
            details you provide (email, optional name, phone, state, and any notes you share). We
            also collect anonymized usage analytics to improve the site.
          </p>
          <h2>How we use it</h2>
          <p>
            Contact details are used to connect you with providers you are matched with, and to
            send editorial updates when you subscribe. We do not sell raw lead data.
          </p>
          <h2>Your rights</h2>
          <p>
            You may request access, correction, or deletion of your data at any time by emailing
            privacy@peptidenexa.com.
          </p>
        </article>
      </Container>
    </>
  );
}
