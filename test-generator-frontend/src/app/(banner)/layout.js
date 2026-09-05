/**
 * Banner Designer route group — full-bleed studio (no BrowseShell max-width).
 */
import { Great_Vibes, Playfair_Display } from "next/font/google";
import { Header } from "@/components/shared";

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

export const metadata = {
  title: "Banner Designer",
};

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
