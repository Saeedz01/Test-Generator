import { BookOpen, FileDown, Layers } from "lucide-react";
import { Card, Container, Typography } from "@/components/ui";
import { aboutHighlights } from "../aboutData";

const ICON_MAP = {
  book: BookOpen,
  layers: Layers,
  file: FileDown,
};

/**
 * Three product points as numbered, hoverable cards.
 */
export function AboutHighlights() {
  return (
    <section className="relative z-10 bg-neutral-0 py-16 sm:py-20 dark:bg-neutral-50">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <Typography
            variant="label"
            as="p"
            className="mb-2 font-semibold tracking-[0.08em] text-primary-700 uppercase"
          >
            How it helps
          </Typography>
          <Typography variant="h2">What Testora is for</Typography>
          <Typography variant="body" className="mt-3 text-neutral-600">
            A focused workspace from your class list to a paper you can print.
          </Typography>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {aboutHighlights.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? BookOpen;

            return (
              <li key={item.id}>
                <Card
                  hoverable
                  className="h-full border-neutral-200"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-50 text-primary-700">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <Typography
                      variant="caption"
                      as="span"
                      className="font-semibold tracking-[0.12em] text-primary-400"
                    >
                      {item.step}
                    </Typography>
                  </div>
                  <Typography variant="h5" as="h3">
                    {item.title}
                  </Typography>
                  <Typography variant="bodySmall" className="mt-2 leading-relaxed">
                    {item.body}
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
