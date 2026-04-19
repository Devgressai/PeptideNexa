import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

export type FaqItem = { question: string; answer: string };

type FaqBlockProps = {
  items: FaqItem[];
  heading?: string;
};

export function FaqBlock({ items, heading = "Frequently asked questions" }: FaqBlockProps) {
  if (items.length === 0) return null;
  const hasHeading = heading.trim().length > 0;
  return (
    <section
      aria-labelledby={hasHeading ? "faq-heading" : undefined}
      aria-label={hasHeading ? undefined : "Frequently asked questions"}
      className={hasHeading ? "mt-16" : undefined}
    >
      {hasHeading ? (
        <h2 id="faq-heading" className="font-serif text-display-md text-ink">
          {heading}
        </h2>
      ) : null}
      <dl className={cn("divide-y divide-line border-y border-line", hasHeading && "mt-6")}>
        {items.map((item) => (
          <div key={item.question} className="grid gap-2 py-5 md:grid-cols-[minmax(0,1fr)_2fr] md:gap-8">
            <dt className="font-medium text-ink">{item.question}</dt>
            <dd className="text-ink-muted">{item.answer}</dd>
          </div>
        ))}
      </dl>
      <JsonLd data={faqSchema(items)} />
    </section>
  );
}
