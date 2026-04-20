import { ArrowUpRight } from "lucide-react";

type SourceChipProps = {
  href: string;
  children: React.ReactNode;
};

// Inline citation used inside MDX bodies, e.g. <SourceChip href="https://pubmed...">Smith 2023</SourceChip>.
// Always opens in a new tab, tagged nofollow/sponsored-neutral for safety.
export function SourceChip({ href, children }: SourceChipProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener external"
      className="inline-flex items-center gap-0.5 rounded-sm border border-line bg-paper-raised px-2 py-0.5 text-[11px] font-medium text-ink-muted no-underline transition-colors duration-sm hover:border-line-strong hover:bg-paper-sunken hover:text-ink-strong"
    >
      {children}
      <ArrowUpRight aria-hidden className="h-3 w-3" />
    </a>
  );
}
