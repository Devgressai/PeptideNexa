import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const MAX_LEVEL = 5;

export const EVIDENCE_TIER_LABELS: Record<number, string> = {
  0: "None · theoretical",
  1: "Preclinical only",
  2: "Limited clinical",
  3: "Moderate clinical",
  4: "Strong clinical",
  5: "Extensive clinical",
};

const barVariants = cva("rounded-[1px] transition-colors", {
  variants: {
    size: {
      xs: "h-1 w-3",
      sm: "h-1.5 w-4",
      md: "h-1.5 w-5",
    },
  },
  defaultVariants: { size: "sm" },
});

type EvidenceTierProps = VariantProps<typeof barVariants> & {
  level: number;
  /** Show the inline label ("Evidence") on the left. */
  showLabel?: boolean;
  /** Show the x/5 fraction on the right. */
  showCount?: boolean;
  className?: string;
};

/**
 * The 0–5 evidence bar used on peptide cards, peptide detail pages, and the
 * methodology page. A single source of truth so the visual language stays
 * consistent wherever evidence is surfaced.
 */
export function EvidenceTier({
  level,
  size,
  showLabel = false,
  showCount = false,
  className,
}: EvidenceTierProps) {
  const clamped = Math.min(Math.max(level, 0), MAX_LEVEL);
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      title={`Evidence tier ${clamped} of ${MAX_LEVEL}`}
    >
      {showLabel ? (
        <span className="text-[10px] font-medium uppercase tracking-wider text-ink-subtle">
          Evidence
        </span>
      ) : null}
      <span
        aria-label={`Evidence tier ${clamped} of ${MAX_LEVEL}`}
        className="flex items-center gap-0.5"
      >
        {Array.from({ length: MAX_LEVEL }).map((_, i) => (
          <span
            key={i}
            className={cn(
              barVariants({ size }),
              i < clamped ? "bg-brand" : "bg-line-strong",
            )}
          />
        ))}
      </span>
      {showCount ? (
        <span className="font-mono text-xs text-ink-subtle">
          {clamped}/{MAX_LEVEL}
        </span>
      ) : null}
    </div>
  );
}

type EvidenceTierLegendProps = {
  /** Optional highlighted tier, e.g. the tier of the current peptide. */
  level?: number;
  className?: string;
};

/**
 * Full 0–5 tier legend with names and descriptions. Meant for the methodology
 * page and expanded aside contexts. For compact surfaces, use `EvidenceTier`.
 */
export function EvidenceTierLegend({ level, className }: EvidenceTierLegendProps) {
  const current = typeof level === "number" ? Math.min(Math.max(level, 0), MAX_LEVEL) : null;
  return (
    <dl className={cn("space-y-3", className)}>
      {Array.from({ length: MAX_LEVEL + 1 })
        .map((_, i) => MAX_LEVEL - i) // 5 → 0
        .map((i) => (
          <div
            key={i}
            className={cn(
              "grid grid-cols-[auto_1fr] items-start gap-x-4 rounded-sm border-l-2 py-1 pl-3",
              current === i ? "border-brand bg-brand-soft/40" : "border-transparent",
            )}
          >
            <dt>
              <EvidenceTier level={i} size="sm" />
            </dt>
            <dd>
              <p className="font-mono text-[11px] text-ink-subtle">Tier {i}</p>
              <p className="text-sm text-ink-strong">{EVIDENCE_TIER_LABELS[i]}</p>
            </dd>
          </div>
        ))}
      <p className="pt-2 text-xs text-ink-muted">
        Evidence tier is an editorial judgment by our clinical reviewers.{" "}
        <Link
          href="/methodology#evidence-tiers"
          className="text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
        >
          Full methodology
        </Link>
        .
      </p>
    </dl>
  );
}
