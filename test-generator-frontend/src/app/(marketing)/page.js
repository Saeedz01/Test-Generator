import { BRAND_NAME } from "@/constants";
import { SITE_URL } from "@/constants/site";
import { FeaturedClasses, Features, Hero, HomeCta, HowItWorks, Statistics } from "./features";

export const metadata = {
  alternates: { canonical: "/" },
};

/**
 * WebSite structured data: helps search engines show the correct site name
 * next to results. Only facts that are true of this site.
 */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND_NAME,
  description:
    "Chapter-wise question bank and test paper generator for teachers, with English and Urdu papers.",
  inLanguage: ["en", "ur"],
  ...(SITE_URL ? { url: SITE_URL } : {}),
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero />
      <FeaturedClasses />
      <HowItWorks />
      <Features />
      <Statistics />
      <HomeCta />
    </main>
  );
}
