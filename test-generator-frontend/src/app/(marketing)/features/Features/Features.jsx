import {
  FileDown,
  Layers,
  ListChecks,
  MousePointerClick,
  Search,
  Sparkles,
} from "lucide-react";
import { Card, Container, Typography } from "@/components/ui";
import { platformFeatures } from "@/data/home";

const ICON_MAP = {
  sparkles: Sparkles,
  layers: Layers,
  file: FileDown,
  list: ListChecks,
  mouse: MousePointerClick,
  search: Search,
};

/**
 * Six platform capability cards.
 */
export function Features() {
  return (
    <section className="bg-neutral-50 py-16 sm:py-20">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <Typography variant="h2">Everything you need to build papers</Typography>
          <Typography variant="body" className="mt-3 text-neutral-600">
            Thoughtful tools designed for teachers who want clarity, speed, and
            consistent exam quality.
          </Typography>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((feature) => {
            const Icon = ICON_MAP[feature.icon] ?? Sparkles;

            return (
              <li key={feature.id}>
                <Card className="h-full border-neutral-200/90 bg-neutral-0">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-primary-50 text-primary-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <Typography variant="h5" as="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="bodySmall" className="mt-2 leading-relaxed">
                    {feature.description}
                  </Typography>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
