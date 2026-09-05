import { FeaturedClasses, Features, Hero, HomeCta, HowItWorks, Statistics } from "./features";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <FeaturedClasses />
      <HowItWorks />
      <Features />
      <Statistics />
      <HomeCta />
    </main>
  );
}
