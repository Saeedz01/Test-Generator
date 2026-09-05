import { Suspense } from "react";
import { BannerStudio } from "../features";

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
