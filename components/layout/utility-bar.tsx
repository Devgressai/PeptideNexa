import Link from "next/link";
import { Container } from "./container";

// Keep in sync with /app/(marketing)/editorial-policy and the footer signature.
const LAST_SITE_REVIEW = "April 14, 2026";

/**
 * Slim utility strip above the main header. Hosts trust + policy links and
 * the last-site-review date so the signal is visible on every page, not
 * buried in the footer.
 */
export function UtilityBar() {
  return (
    <div
      role="complementary"
      aria-label="Editorial trust"
      className="hidden border-b border-line bg-paper-sunken md:block"
    >
      <Container className="flex h-9 items-center justify-between text-[12px] text-ink-subtle">
        <nav aria-label="Trust" className="flex items-center gap-5">
          <Link
            href="/editorial-policy"
            className="transition-colors duration-sm hover:text-ink-strong focus-ring rounded-sm"
          >
            Editorial Policy
          </Link>
          <span aria-hidden className="text-line-strong">
            ·
          </span>
          <Link
            href="/legal/affiliate-disclosure"
            className="transition-colors duration-sm hover:text-ink-strong focus-ring rounded-sm"
          >
            Affiliate Disclosure
          </Link>
          <span aria-hidden className="text-line-strong">
            ·
          </span>
          <Link
            href="/for-providers"
            className="transition-colors duration-sm hover:text-ink-strong focus-ring rounded-sm"
          >
            For providers
          </Link>
        </nav>
        <p className="flex items-center gap-2">
          <span className="eyebrow">Last site review</span>
          <span className="font-medium text-ink-muted">{LAST_SITE_REVIEW}</span>
        </p>
      </Container>
    </div>
  );
}
