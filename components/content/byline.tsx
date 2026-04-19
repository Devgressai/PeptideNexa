import type { Author } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type BylineProps = {
  author: Author | null;
  reviewer?: Author | null;
  className?: string;
};

export function Byline({ author, reviewer, className }: BylineProps) {
  if (!author && !reviewer) return null;
  return (
    <div className={cn("flex flex-col gap-1 text-sm text-ink-muted", className)}>
      {author ? (
        <p>
          <span className="text-ink-subtle">Written by </span>
          <span className="font-medium text-ink">{author.name}</span>
          {author.credentials ? <span className="text-ink-subtle">, {author.credentials}</span> : null}
        </p>
      ) : null}
      {reviewer ? (
        <p>
          <span className="text-ink-subtle">Reviewed by </span>
          <span className="font-medium text-ink">{reviewer.name}</span>
          {reviewer.credentials ? <span className="text-ink-subtle">, {reviewer.credentials}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
