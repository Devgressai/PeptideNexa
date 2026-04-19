import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PeptideSummary } from "@/lib/content/types";

type PeptideCardProps = {
  peptide: PeptideSummary;
};

export function PeptideCard({ peptide }: PeptideCardProps) {
  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className="group flex h-full flex-col rounded-lg border border-line bg-paper p-6 shadow-card transition-shadow hover:shadow-raised"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="muted">{peptide.category.name}</Badge>
          <h3 className="mt-3 font-serif text-xl text-ink">{peptide.name}</h3>
        </div>
        <ArrowUpRight
          aria-hidden
          className="mt-1 h-4 w-4 text-ink-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-ink-muted">{peptide.summary}</p>

      {peptide.commonForms.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {peptide.commonForms.slice(0, 3).map((form) => (
            <Badge key={form} variant="default">
              {form}
            </Badge>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
