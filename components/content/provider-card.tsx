import Link from "next/link";
import { ShieldCheck, MapPin, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProviderSummary } from "@/lib/content/types";

type ProviderCardProps = {
  provider: ProviderSummary;
};

const typeLabel: Record<ProviderSummary["type"], string> = {
  ONLINE: "Online provider",
  CLINIC: "Clinic",
  COMPOUNDING: "Compounding pharmacy",
};

export function ProviderCard({ provider }: ProviderCardProps) {
  const location =
    provider.type === "ONLINE"
      ? provider.servesStates.length > 0
        ? `Ships to ${provider.servesStates.length} states`
        : "Online"
      : [provider.city, provider.state].filter(Boolean).join(", ");

  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-paper p-6 shadow-card">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg text-ink">
              <Link href={`/providers/${provider.slug}`} className="hover:text-brand">
                {provider.name}
              </Link>
            </h3>
            {provider.verified ? (
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <ShieldCheck aria-hidden className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-ink-subtle">{typeLabel[provider.type]}</p>
        </div>
        {provider.featured ? <Badge variant="signal">Featured</Badge> : null}
      </header>

      <p className="mt-3 line-clamp-3 text-sm text-ink-muted">{provider.shortDescription}</p>

      <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-muted">
        {location ? (
          <div className="flex items-center gap-1.5">
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
            <dt className="sr-only">Price</dt>
            <dd>{priceTierLabel(provider.priceTier)}</dd>
          </div>
        ) : null}
      </dl>

      <footer className="mt-6 flex items-center gap-3">
        <Link
          href={`/providers/${provider.slug}`}
          className="text-sm font-medium text-ink hover:text-brand"
        >
          View profile →
        </Link>
      </footer>
    </article>
  );
}

function priceTierLabel(tier: NonNullable<ProviderSummary["priceTier"]>) {
  switch (tier) {
    case "ECONOMY":
      return "$";
    case "STANDARD":
      return "$$";
    case "PREMIUM":
      return "$$$";
  }
}
