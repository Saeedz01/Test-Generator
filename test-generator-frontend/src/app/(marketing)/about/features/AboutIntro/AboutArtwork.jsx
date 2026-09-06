import { Typography } from "@/components/ui";
import { BrandMark } from "@/components/shared/BrandLogo";
import { aboutPaper } from "../aboutData";

/**
 * Stacked exam-paper preview — product visual, no stock illustration.
 */
export function AboutArtwork() {
  return (
    <div className="relative mx-auto w-full max-w-md px-2 pb-3 lg:ml-auto">
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-8 h-[calc(100%-1.5rem)] rotate-3 rounded-[var(--radius-card)] border border-neutral-200 bg-primary-50"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-3 top-4 h-[calc(100%-0.75rem)] -rotate-2 rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0"
      />

      <article className="relative rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-200 pb-4">
          <div className="min-w-0">
            <Typography variant="caption" className="uppercase tracking-[0.08em]">
              {aboutPaper.institute}
            </Typography>
            <Typography variant="h5" as="p" className="mt-1">
              {aboutPaper.title}
            </Typography>
            <Typography variant="caption" className="mt-1">
              {aboutPaper.meta}
            </Typography>
          </div>
          <BrandMark className="size-9" />
        </div>

        <ol className="mt-4 space-y-3">
          {aboutPaper.items.map((item, index) => (
            <li
              key={item.type}
              className="rounded-[var(--radius-md)] border border-neutral-100 bg-neutral-50 px-3 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <Typography
                  variant="caption"
                  as="span"
                  className="font-semibold tracking-[0.08em] text-primary-700 uppercase"
                >
                  Q{index + 1} · {item.type}
                </Typography>
                <span
                  className="size-2 rounded-full bg-primary-500"
                  aria-hidden="true"
                />
              </div>
              <Typography variant="bodySmall" className="mt-1.5">
                {item.prompt}
              </Typography>
              {item.type === "MCQ" ? (
                <div className="mt-2 flex gap-2" aria-hidden="true">
                  {["A", "B", "C", "D"].map((opt) => (
                    <Typography
                      key={opt}
                      variant="caption"
                      as="span"
                      className="inline-flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-0 font-medium text-neutral-600"
                    >
                      {opt}
                    </Typography>
                  ))}
                </div>
              ) : (
                <div className="mt-2 space-y-1.5" aria-hidden="true">
                  <span className="block h-1.5 w-full rounded-full bg-neutral-200" />
                  <span className="block h-1.5 w-4/5 rounded-full bg-neutral-200" />
                  {item.type === "Long" ? (
                    <span className="block h-1.5 w-3/5 rounded-full bg-neutral-200" />
                  ) : null}
                </div>
              )}
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}
