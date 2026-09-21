import { Suspense } from "react";
import { BannerStudio } from "../features";

export const metadata = {
  title: "Banner studio",
  // An editing surface whose content lives on the visitor's device.
  robots: { index: false, follow: true },
};

export default function BannerStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-small text-neutral-600">Loading studio…</div>
      }
    >
      <BannerStudio />
    </Suspense>
  );
}
