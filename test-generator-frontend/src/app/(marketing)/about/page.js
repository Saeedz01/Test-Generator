import { AboutCta, AboutHighlights, AboutIntro, AboutStory } from "./features";

export const metadata = {
  title: "About",
  description:
    "Testora is a calm workspace for teachers to assemble balanced, print-ready exam papers from chapter-wise MCQs, short, and long questions.",
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
