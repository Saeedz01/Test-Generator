import { ImageResponse } from "next/og";
import { BRAND_NAME } from "@/constants";

export const alt = `${BRAND_NAME} — chapter-wise question bank and test paper generator`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Shared social preview image (also used as the Twitter card image). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #587b2a 0%, #3f5a1d 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
          {BRAND_NAME}
        </div>
        <div style={{ marginTop: 24, fontSize: 40, lineHeight: 1.3, opacity: 0.95 }}>
          Build exam papers from a chapter-wise question bank
        </div>
        <div style={{ marginTop: 32, fontSize: 28, opacity: 0.85 }}>
          MCQs · Short questions · Long questions · English &amp; Urdu
        </div>
      </div>
    ),
    size,
  );
}
