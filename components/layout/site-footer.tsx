import Link from "next/link";
import type { Route } from "next";
import { Container } from "./container";

const columns: Array<{
  heading: string;
  links: Array<{ label: string; href: Route }>;
}> = [
  {
    heading: "Explore",
    links: [
      { label: "Peptides", href: "/peptides" },
      { label: "Providers", href: "/providers" },
      { label: "Compare", href: "/compare" },
      { label: "Guides", href: "/guides" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Methodology", href: "/methodology" },
      { label: "Editorial policy", href: "/editorial-policy" },
      { label: "For providers", href: "/for-providers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Affiliate disclosure", href: "/legal/affiliate-disclosure" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-raised">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-6 w-6 text-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="7" cy="8" r="2" fill="currentColor" />
                <circle cx="17" cy="16" r="2" fill="currentColor" />
                <circle cx="7" cy="16" r="1.5" />
                <circle cx="17" cy="8" r="1.5" />
                <line x1="7" y1="8" x2="17" y2="8" />
                <line x1="7" y1="16" x2="17" y2="16" />
                <line x1="7" y1="8" x2="17" y2="16" />
              </svg>
              <span className="font-serif text-lg tracking-tight text-ink">PeptideNexa</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-muted">
              An independent editorial and directory platform for peptide research and provider
              discovery. We are not a medical provider.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                {col.heading}
              </h2>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-ink-subtle md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} PeptideNexa. Educational and informational use only.</p>
          <p>
            This site does not provide medical advice, diagnosis, or treatment. Always consult a
            qualified clinician.
          </p>
        </div>
      </Container>
    </footer>
  );
}
