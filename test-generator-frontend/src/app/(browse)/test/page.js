import { TestSummary } from "./features";

export const metadata = {
  title: "Test summary",
  description:
    "Review selected questions, set paper options, and print or download your test paper.",
  // The page only shows questions this visitor picked on this device.
  robots: { index: false, follow: true },
};

export default function TestSummaryPage() {
  return <TestSummary />;
}
