type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

// Emits schema.org JSON-LD. Kept as a server component so markup is rendered
// in HTML rather than hydrated client-side.
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Schema.org JSON-LD is content, not executable script. Stripping
      // ambiguous unicode prevents early-close injection.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
