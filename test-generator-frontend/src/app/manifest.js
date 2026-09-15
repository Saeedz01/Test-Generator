import { BRAND_NAME } from "@/constants";

/** @type {import('next').MetadataRoute.Manifest} */
export default function manifest() {
  return {
    name: BRAND_NAME,
    short_name: "Testora",
    description:
      "Testora helps teachers assemble balanced exam papers from chapter-wise MCQs, short, and long questions.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#587b2a",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
