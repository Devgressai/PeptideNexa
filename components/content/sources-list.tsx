type Source = {
  title: string;
  url: string;
  publisher: string | null;
  year: number | null;
};

type SourcesListProps = {
  sources: Source[];
};

export function SourcesList({ sources }: SourcesListProps) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading" className="mt-16">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="sources-heading" className="font-serif text-display-md text-ink-strong">
          Sources
        </h2>
        <p className="font-mono text-xs text-ink-subtle">
          {sources.length} {sources.length === 1 ? "citation" : "citations"}
        </p>
      </div>
      <ol className="mt-6 space-y-4 border-l border-line pl-6 text-sm leading-relaxed text-ink-muted">
        {sources.map((source, index) => (
          <li key={source.url} className="relative">
            <span aria-hidden className="absolute -left-7 font-mono text-xs text-ink-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
            <a
              href={source.url}
              rel="nofollow noopener external"
              target="_blank"
              className="font-medium text-ink-strong transition-colors duration-sm hover:text-brand focus-ring rounded-sm"
            >
              {source.title}
            </a>
            {source.publisher || source.year ? (
              <span className="text-ink-subtle">
                {" — "}
                {[source.publisher, source.year].filter(Boolean).join(", ")}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
