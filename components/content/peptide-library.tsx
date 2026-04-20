"use client";

import * as React from "react";
import Link from "next/link";
import { Search as SearchIcon, X } from "lucide-react";

import { PeptideCard } from "./peptide-card";
import { Input } from "@/components/ui/input";
import type { PeptideSummary } from "@/lib/content/types";

type PeptideLibraryProps = {
  peptides: PeptideSummary[];
};

/**
 * Client-side filter over the fully-hydrated peptide list. Keeps the index
 * page snappy without a server round-trip per keystroke; server-rendered HTML
 * remains the source of truth until JS boots.
 */
export function PeptideLibrary({ peptides }: PeptideLibraryProps) {
  const [query, setQuery] = React.useState("");
  const trimmed = query.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    if (trimmed.length === 0) return peptides;
    return peptides.filter((p) => {
      const haystack = [
        p.name,
        p.summary,
        p.category.name,
        ...p.aliases,
        ...p.commonForms,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [peptides, trimmed]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">All peptides</p>
          <p className="mt-1 font-mono text-xs text-ink-subtle">
            {filtered.length === peptides.length
              ? `${peptides.length} entries · reviewed quarterly`
              : `${filtered.length} of ${peptides.length} entries`}
          </p>
        </div>

        <div className="relative w-full md:max-w-xs">
          <label htmlFor="peptide-filter" className="sr-only">
            Filter peptides
          </label>
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
          />
          <Input
            id="peptide-filter"
            type="search"
            placeholder="Filter by name, alias, category…"
            autoComplete="off"
            className="pl-9 pr-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear filter"
              onClick={() => setQuery("")}
              className="absolute right-1.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-sm text-ink-subtle transition-colors duration-sm hover:bg-paper-sunken hover:text-ink-strong focus-ring"
            >
              <X aria-hidden className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyFilterState query={query} onClear={() => setQuery("")} />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((peptide) => (
            <PeptideCard key={peptide.slug} peptide={peptide} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyFilterState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="mt-8 rounded-md border border-dashed border-line-strong bg-paper-raised p-12 text-center">
      <p className="eyebrow">No matches</p>
      <p className="mt-3 font-serif text-xl text-ink-strong">
        No peptides match &ldquo;{query}&rdquo;.
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        Try a shorter query, a category name, or{" "}
        <Link
          href="/methodology"
          className="font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
        >
          check the methodology
        </Link>{" "}
        to see what we cover.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 inline-flex items-center gap-1.5 rounded-sm border border-line bg-paper-raised px-3 py-1.5 text-sm font-medium text-ink-strong transition-colors duration-sm hover:border-line-strong hover:bg-paper-sunken focus-ring"
      >
        Clear filter
      </button>
    </div>
  );
}
