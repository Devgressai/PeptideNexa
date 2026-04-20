import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const runtime = "edge";

// Dynamic favicon. Until we have a designed mark, render the brand square on
// a paper background so browsers don't log a 404 for /favicon.ico.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBFCFD",
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            background: "#3D6A8A",
            borderRadius: "3px",
          }}
        />
      </div>
    ),
    size,
  );
}
