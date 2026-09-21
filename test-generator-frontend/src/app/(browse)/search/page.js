import { Suspense } from "react";
import { pageMetadata } from "@/constants/seo";
import { SearchResults } from "./features";

// Result pages are per-query and thin; keep them out of the index but let
// crawlers follow the links to the real content.
export const metadata = pageMetadata({
  title: "Search",
  description:
    "Search Testora's library of classes, books, chapters and questions in English and Urdu.",
  path: "/search",
  noindex: true,
});

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
