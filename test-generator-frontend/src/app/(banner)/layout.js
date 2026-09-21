/**
 * Banner Designer route group — full-bleed studio (no BrowseShell max-width).
 */
import { Great_Vibes, Playfair_Display } from "next/font/google";
import { Header } from "@/components/shared";
import { pageMetadata } from "@/constants/seo";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = pageMetadata({
  title: "Banner Designer",
  description:
    "Design and download academy banners — admission flyers, result cards and topper boards — from editable templates.",
  path: "/banner",
});

export default function BannerLayout({ children }) {
  return (
    <div
      className={`${playfair.variable} ${script.variable} flex min-h-full flex-1 flex-col bg-neutral-50`}
    >
      <Header />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
