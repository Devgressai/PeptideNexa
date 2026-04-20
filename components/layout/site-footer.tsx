import Link from "next/link";
import type { Route } from "next";
import { Linkedin, Rss, Twitter, Youtube } from "lucide-react";
import { Container } from "./container";

// Keep in sync with UtilityBar and editorial policy.
const LAST_SITE_REVIEW = "April 14, 2026";

type Column = {
  heading: string;
  links: Array<{ label: string; href: string }>;
};

// Six dense columns — directory → discovery → learn → trust → company → legal.
// Density is intentional: this is the site map, and the site is bigger than
// any header nav can show. Every link here is a real destination.
const columns: Column[] = [
  {
    heading: "Directory",
    links: [
      { label: "Peptide library", href: "/peptides" },
      { label: "Provider directory", href: "/providers" },
      { label: "Compare peptides", href: "/compare" },
      { label: "Matching quiz", href: "/match" },
      { label: "Search", href: "/search" },
      { label: "Editorial hub", href: "/guides" },
    ],
  },
  {
    heading: "Popular peptides",
    links: [
      { label: "BPC-157", href: "/peptides/bpc-157" },
      { label: "TB-500", href: "/peptides/tb-500" },
      { label: "Semaglutide", href: "/peptides/semaglutide" },
      { label: "Tirzepatide", href: "/peptides/tirzepatide" },
      { label: "Ipamorelin", href: "/peptides/ipamorelin" },
      { label: "CJC-1295", href: "/peptides/cjc-1295" },
    ],
  },
  {
    heading: "By category",
    links: [
      { label: "Healing & repair", href: "/peptides/categories/healing-repair" },
      { label: "Growth hormone secretagogues", href: "/peptides/categories/ghs" },
      { label: "Metabolic", href: "/peptides/categories/metabolic" },
      { label: "Cognitive", href: "/peptides/categories/cognitive" },
      { label: "Longevity", href: "/peptides/categories/longevity" },
      { label: "Immune & inflammation", href: "/peptides/categories/immune" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "How we review", href: "/methodology" },
      { label: "Evidence tiers", href: "/methodology#evidence-tiers" },
      { label: "Editorial policy", href: "/editorial-policy" },
      { label: "Editorial board", href: "/editorial-policy" },
      { label: "Corrections policy", href: "/editorial-policy" },
      { label: "Affiliate disclosure", href: "/legal/affiliate-disclosure" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "For providers", href: "/for-providers" },
      { label: "Press", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Research digest", href: "/" },
      { label: "Contact", href: "/editorial-policy" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Terms of use", href: "/legal/terms" },
      { label: "Affiliate disclosure", href: "/legal/affiliate-disclosure" },
      { label: "Accessibility", href: "/editorial-policy" },
      { label: "Do not sell my info", href: "/legal/privacy" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];

const TRUST_BADGES: Array<{ label: string; detail: string }> = [
  { label: "Editorially independent", detail: "Rankings not moved by payment" },
  { label: "Sourced back to primary literature", detail: "Every claim cited" },
  { label: "Reviewed by named clinicians", detail: "Credentials on every page" },
  { label: "Re-verified quarterly", detail: "Last: April 14, 2026" },
];

const SOCIAL: Array<{ label: string; href: string; Icon: typeof Twitter }> = [
  { label: "PeptideNexa on X", href: "https://x.com/peptidenexa", Icon: Twitter },
  { label: "PeptideNexa on LinkedIn", href: "https://linkedin.com/company/peptidenexa", Icon: Linkedin },
  { label: "PeptideNexa on YouTube", href: "https://youtube.com/@peptidenexa", Icon: Youtube },
  { label: "Research digest RSS", href: "/rss.xml", Icon: Rss },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-raised">
      {/* ───── Brand + mission + stat strip ─────────────────────────────── */}
      <section className="border-b border-line">
        <Container className="py-14 md:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start lg:gap-20">
            <div>
              <div className="flex items-center gap-2.5">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-7 w-7 text-brand"
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
                <span className="font-serif text-xl tracking-tight text-ink-strong">
                  PeptideNexa
                </span>
              </div>
              <p className="mt-6 max-w-xl font-serif text-2xl leading-snug text-ink-strong text-balance md:text-[1.75rem]">
                An independent editorial and directory platform for peptide research and
                provider discovery.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
                We are not a medical provider. Every page on PeptideNexa is educational and
                informational. Written in-house, reviewed by clinically credentialed advisors,
                and cited back to the public literature.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-y-6 border-t border-line pt-6 lg:border-t-0 lg:pt-0">
              <div>
                <dt className="eyebrow">Peptides</dt>
                <dd className="mt-1.5 font-serif text-2xl leading-none text-ink-strong">
                  40+
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Providers</dt>
                <dd className="mt-1.5 font-serif text-2xl leading-none text-ink-strong">
                  20+
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Sources min</dt>
                <dd className="mt-1.5 font-serif text-2xl leading-none text-ink-strong">
                  2 per page
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Re-verification</dt>
                <dd className="mt-1.5 font-serif text-2xl leading-none text-ink-strong">
                  Quarterly
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      {/* ───── 6-column link grid ────────────────────────────────────────── */}
      <section className="border-b border-line">
        <Container className="py-14 md:py-16">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8">
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
        </Container>
      </section>

      {/* ───── Trust badges + social ─────────────────────────────────────── */}
      <section className="border-b border-line bg-paper-sunken/60">
        <Container className="py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
            <ul className="flex flex-wrap items-center gap-2">
              {TRUST_BADGES.map((badge) => (
                <li key={badge.label}>
                  <span className="inline-flex flex-col rounded-sm border border-line bg-paper-raised px-3 py-2">
                    <span className="font-medium text-ink-strong text-[12px]">
                      {badge.label}
                    </span>
                    <span className="mt-0.5 text-[11px] text-ink-subtle">{badge.detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 lg:items-end">
              <p className="eyebrow">Follow</p>
              <ul className="flex items-center gap-2">
                {SOCIAL.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-paper-raised text-ink-muted transition-colors duration-sm hover:border-line-strong hover:bg-paper-sunken hover:text-ink-strong focus-ring"
                    >
                      <Icon aria-hidden className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── Legal signature row ───────────────────────────────────────── */}
      <section className="bg-paper-sunken">
        <Container className="py-6">
          <div className="flex flex-col gap-3 text-[11.5px] text-ink-subtle md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>© {new Date().getFullYear()} PeptideNexa.</span>
              <span aria-hidden className="text-line-strong">
                ·
              </span>
              <span>Educational and informational use only.</span>
              <span aria-hidden className="text-line-strong">
                ·
              </span>
              <span>
                This site does not provide medical advice, diagnosis, or treatment.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="eyebrow">Last site review</span>
              <span className="font-medium text-ink-muted">{LAST_SITE_REVIEW}</span>
            </div>
          </div>
        </Container>
      </section>
    </footer>
  );
}
