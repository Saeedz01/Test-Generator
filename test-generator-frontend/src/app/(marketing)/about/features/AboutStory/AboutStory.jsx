import { Check } from "lucide-react";
import { Container, Typography } from "@/components/ui";
import { aboutStory } from "../aboutData";

/**
 * Why Testora exists — narrative plus proof points.
 */
export function AboutStory() {
  return (
    <section className="bg-neutral-50 py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="max-w-xl">
            <Typography
              variant="label"
              as="p"
              className="mb-2 font-semibold tracking-[0.08em] text-primary-700 uppercase"
            >
              {aboutStory.eyebrow}
            </Typography>
            <Typography variant="h2">{aboutStory.headline}</Typography>
            <Typography variant="body" className="mt-4 text-neutral-600">
              {aboutStory.body}
            </Typography>
          </div>

          <ul className="space-y-3">
            {aboutStory.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-4 shadow-xs"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                <Typography variant="bodySmall" className="pt-1.5 leading-relaxed">
                  {point}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
