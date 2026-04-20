import { ImageResponse } from "next/og";

export const runtime = "edge";

// Dynamic default OpenGraph image. Avoids shipping a static 1200x630 asset
// that has to be maintained in sync with brand updates. For entity-specific
// OG images, a later epic adds /og/peptide/[slug] and similar routes.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "#FBFCFD",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "28px",
            letterSpacing: "-0.01em",
            color: "#0D1A2C",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "4px",
              background: "#3D6A8A",
            }}
          />
          PeptideNexa
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#0D1A2C",
              maxWidth: "900px",
            }}
          >
            Research peptides. Compare providers. Decide with confidence.
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#45516A",
              maxWidth: "800px",
            }}
          >
            Independent. Editorial. Sourced.
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
