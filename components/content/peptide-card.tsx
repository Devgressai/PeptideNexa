import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PeptideSummary } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type PeptideCardProps = {
  peptide: PeptideSummary;
};

export function PeptideCard({ peptide }: PeptideCardProps) {
  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-ink-subtle hover:shadow-raised"
    >
      {/* Quiet accent bar that becomes visible on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-0.5 bg-brand opacity-0 transition-opacity group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-3">
        <Badge variant="muted">{peptide.category.name}</Badge>
        <ArrowUpRight
          aria-hidden
          className="h-4 w-4 text-ink-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
        />
      </div>

      <h3 className="mt-4 font-serif text-2xl text-ink">{peptide.name}</h3>

      {peptide.aliases.length > 0 ? (
        <p className="mt-1 text-xs text-ink-subtle">{peptide.aliases[0]}</p>
      ) : null}

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-muted">{peptide.summary}</p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <ResearchLevel level={peptide.researchLevel} />
        {peptide.commonForms.length > 0 ? (
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
            {peptide.commonForms.slice(0, 2).join(" · ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function ResearchLevel({ level }: { level: number }) {
  const clamped = Math.min(Math.max(level, 0), 5);
  return (
    <div className="flex items-center gap-1.5" title={`Research level ${clamped} of 5`}>
      <span className="text-[10px] uppercase tracking-wider text-ink-subtle">Research</span>
      <span className="flex items-center gap-0.5" aria-label={`Research level ${clamped} of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 w-3 rounded-sm transition-colors",
              i < clamped ? "bg-brand" : "bg-line",
            )}
          />
        ))}
      </span>
    </div>
  );
}
