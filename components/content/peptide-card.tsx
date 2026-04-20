import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PeptideSummary } from "@/lib/content/types";
import { EvidenceTier } from "./evidence-tier";

type PeptideCardProps = {
  peptide: PeptideSummary;
};

/**
 * Rule-divider card: hairline border, tight radius, typographic eyebrow for
 * category (not a pill badge), inline evidence tier in the footer, and a quiet
 * brand accent rail that appears on hover.
 */
export function PeptideCard({ peptide }: PeptideCardProps) {
  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className="group relative flex h-full flex-col rounded-md border border-line bg-paper-raised p-6 transition-all duration-sm hover:border-line-strong hover:shadow-e2 focus-ring"
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-0.5 bg-brand opacity-0 transition-opacity duration-sm group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{peptide.category.name}</p>
        <ArrowUpRight
          aria-hidden
          className="h-4 w-4 text-ink-subtle transition-transform duration-sm group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-strong"
        />
      </div>

      <h3 className="mt-3 font-serif text-2xl leading-tight text-ink-strong transition-colors duration-sm group-hover:text-brand">
        {peptide.name}
      </h3>

      {peptide.aliases.length > 0 ? (
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink-subtle">
          Also known as · {peptide.aliases[0]}
        </p>
      ) : null}

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-muted">
        {peptide.summary}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5">
        <EvidenceTier level={peptide.researchLevel} size="xs" showLabel />
        {peptide.commonForms.length > 0 ? (
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
            {peptide.commonForms.slice(0, 2).join(" · ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
