import Link from "next/link";
import type { Route } from "next";
import { Container } from "./container";

// Keep in sync with UtilityBar and editorial policy.
const LAST_SITE_REVIEW = "April 14, 2026";

type Column = {
  heading: string;
  links: Array<{ label: string; href: string }>;
};

const columns: Column[] = [
  {
    heading: "Directory",
    links: [
      { label: "Peptide library", href: "/peptides" },
      { label: "Provider directory", href: "/providers" },
      { label: "Compare peptides", href: "/compare" },
      { label: "Matching quiz", href: "/match" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Editorial hub", href: "/guides" },
      { label: "Calm guide to peptides", href: "/guides/calm-guide-to-peptide-research" },
      { label: "Evidence tiers", href: "/methodology" },
      { label: "Glossary", href: "/guides" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "How we review", href: "/methodology" },
      { label: "Editorial policy", href: "/editorial-policy" },
      { label: "Corrections policy", href: "/editorial-policy" },
      { label: "Editorial board", href: "/editorial-policy" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "For providers", href: "/for-providers" },
      { label: "Press", href: "/about" },
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
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,3fr)] lg:gap-16">
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
              <span className="font-serif text-lg tracking-tight text-ink-strong">
                PeptideNexa
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
              An independent editorial and directory platform for peptide research and provider
              discovery. We are not a medical provider.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-xs">
              <div>
                <dt className="eyebrow">Last site review</dt>
                <dd className="mt-1 font-medium text-ink-strong">{LAST_SITE_REVIEW}</dd>
              </div>
              <div>
                <dt className="eyebrow">Review cadence</dt>
                <dd className="mt-1 font-medium text-ink-strong">Quarterly</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {columns.map((col) => (
              <div key={col.heading}>
                <h2 className="eyebrow">{col.heading}</h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={`${col.heading}-${link.label}`}>
                      <Link
                        href={link.href as Route}
                        className="text-sm text-ink-muted transition-colors duration-sm hover:text-ink-strong focus-ring rounded-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-line pt-7">
          <div className="flex flex-col gap-3 text-xs text-ink-subtle md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} PeptideNexa. Educational and informational use only.
            </p>
            <p>
              This site does not provide medical advice, diagnosis, or treatment. Always consult a
              qualified clinician.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
