import { AboutCta, AboutHighlights, AboutIntro, AboutStory } from "./features";

export const metadata = {
  title: "About",
  description:
    "Testora helps teachers assemble balanced exam papers and design academy banners — from chapter-wise questions to print-ready PDFs and editable templates.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AboutIntro />
      <AboutHighlights />
      <AboutStory />
      <AboutCta />
    </main>
  );
}
