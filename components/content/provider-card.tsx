import Link from "next/link";
import { ArrowRight, Check, Globe2, MapPin, ShieldCheck } from "lucide-react";
import type { ProviderSummary } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type ProviderCardProps = {
  provider: ProviderSummary;
};

const typeLabel: Record<ProviderSummary["type"], string> = {
  ONLINE: "Online provider",
  CLINIC: "In-person clinic",
  COMPOUNDING: "Compounding pharmacy",
};

const priceTierLabel = (tier: NonNullable<ProviderSummary["priceTier"]>) =>
  ({ ECONOMY: "$", STANDARD: "$$", PREMIUM: "$$$" })[tier];

// The verification checklist rendered on verified cards. The schema doesn't
// yet carry a structured checklist — these are the four pillars of our
// verification protocol, documented on /methodology.
const VERIFICATION_CHECKLIST = [
  "License verified",
  "State coverage confirmed",
  "Pricing transparency",
  "Sourcing reviewed",
] as const;

export function ProviderCard({ provider }: ProviderCardProps) {
  const location =
    provider.type === "ONLINE"
      ? provider.servesStates.length > 0
        ? `Ships to ${provider.servesStates.length} states`
        : "Online"
      : [provider.city, provider.state].filter(Boolean).join(", ");

  return (
    <article className="group relative flex h-full flex-col rounded-md border border-line bg-paper-raised p-6 transition-all duration-sm hover:border-line-strong hover:shadow-e2">
      {provider.featured ? (
        <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-sm border border-signal/30 bg-signal-soft px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-signal">
          <span aria-hidden className="h-1 w-1 rounded-full bg-signal" />
          Featured · Labeled commerce
        </span>
      ) : null}

      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{typeLabel[provider.type]}</p>
          <h3 className="mt-1.5 font-serif text-xl leading-tight text-ink-strong">
            <Link
              href={`/providers/${provider.slug}`}
              className="transition-colors duration-sm hover:text-brand focus-ring rounded-sm"
            >
              {provider.name}
            </Link>
          </h3>
        </div>
        {provider.verified ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            <ShieldCheck aria-hidden className="h-3 w-3" />
            Verified
          </span>
        ) : null}
      </header>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">
        {provider.shortDescription}
      </p>

      {provider.verified ? (
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] text-ink-muted">
          {VERIFICATION_CHECKLIST.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <Check aria-hidden className="h-3 w-3 shrink-0 text-success" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted">
        {location ? (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Location</dt>
            {provider.type === "ONLINE" ? (
              <Globe2 aria-hidden className="h-3.5 w-3.5" />
            ) : (
              <MapPin aria-hidden className="h-3.5 w-3.5" />
            )}
            <dd>{location}</dd>
          </div>
        ) : null}
        {provider.priceTier ? (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Price tier</dt>
            <dd className="font-mono">{priceTierLabel(provider.priceTier)}</dd>
          </div>
        ) : null}
        {provider.lastVerifiedAt ? (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Last verified</dt>
            <dd>Verified {formatMonth(provider.lastVerifiedAt)}</dd>
          </div>
        ) : null}
      </dl>

      <footer className="mt-6 border-t border-line pt-5">
        <Link
          href={`/providers/${provider.slug}`}
          className={cn(
            "inline-flex items-center gap-1 text-sm font-medium text-ink-strong transition-colors duration-sm hover:text-brand focus-ring rounded-sm",
          )}
        >
          View profile
          <ArrowRight
            aria-hidden
            className="h-3.5 w-3.5 transition-transform duration-sm group-hover:translate-x-0.5"
          />
        </Link>
      </footer>
    </article>
  );
}

function formatMonth(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
