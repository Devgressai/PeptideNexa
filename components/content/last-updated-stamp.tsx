import { formatDate } from "@/lib/utils";

type LastUpdatedStampProps = {
  date: string | Date | null | undefined;
  label?: string;
};

export function LastUpdatedStamp({ date, label = "Last reviewed" }: LastUpdatedStampProps) {
  if (!date) return null;
  const formatted = formatDate(date);
  const iso = typeof date === "string" ? date : date.toISOString();
  return (
    <p className="text-xs uppercase tracking-wider text-ink-subtle">
      {label}{" "}
      <time dateTime={iso} className="normal-case text-ink-muted">
        {formatted}
      </time>
    </p>
  );
}
