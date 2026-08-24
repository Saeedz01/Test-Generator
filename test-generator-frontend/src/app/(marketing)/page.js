import { FeaturedClasses, Features, Hero, HomeCta, Statistics } from "./features";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <FeaturedClasses />
      <Features />
      <Statistics />
      <HomeCta />
    </main>
  );
}
