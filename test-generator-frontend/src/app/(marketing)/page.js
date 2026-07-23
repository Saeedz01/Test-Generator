/**
 * Marketing homepage — composes home feature sections only.
 */
import {
  FeaturedClassesSection,
  FeaturesSection,
  HomeCtaSection,
  HomeHero,
  StatisticsSection,
} from "@/features/home";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <HomeHero />
      <FeaturedClassesSection />
      <FeaturesSection />
      <StatisticsSection />
      <HomeCtaSection />
    </main>
  );
}
