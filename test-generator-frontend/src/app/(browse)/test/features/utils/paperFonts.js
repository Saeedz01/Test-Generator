/**
 * Self-hosted Noto Nastaliq Urdu used by the paper preview, print, and PDF.
 * Files live in `public/fonts/` (same origin, no third-party font request).
 */

export const NASTALIQ_FAMILY = "Noto Nastaliq Urdu";

export const NASTALIQ_FONT_FILES = [
  { weight: 400, path: "/fonts/NotoNastaliqUrdu-Regular.ttf" },
  { weight: 700, path: "/fonts/NotoNastaliqUrdu-Bold.ttf" },
];

/** Current page origin in the browser; empty on the server / in tests. */
export function currentOrigin() {
  return typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "";
}

/**
 * `@font-face` rules with absolute URLs — the paper is rendered inside blob:
 * iframes, where root-relative URLs would not resolve.
 * @param {string} [origin]
 */
export function nastaliqFontFaceCss(origin = currentOrigin()) {
  return NASTALIQ_FONT_FILES.map(
    ({ weight, path }) => `
    @font-face {
      font-family: "${NASTALIQ_FAMILY}";
      font-style: normal;
      font-weight: ${weight};
      font-display: swap;
      src: url("${origin}${path}") format("truetype");
    }`,
  ).join("");
}
