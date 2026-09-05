import { BookOpen, FileDown, ListChecks } from "lucide-react";
import { Card, Container, Typography } from "@/components/ui";

const STEPS = [
  {
    id: "step-class",
    title: "Pick a class",
    body: "Open your grade or group, then choose a book and chapter.",
    Icon: BookOpen,
  },
  {
    id: "step-select",
    title: "Select questions",
    body: "Tick MCQs, short, and long items. Selection stays as you switch chapters.",
    Icon: ListChecks,
  },
  {
    id: "step-print",
    title: "Print PDF",
    body: "Review the paper, set institute and time, then print a clean exam.",
    Icon: FileDown,
  },
];

/**
 * Three-step teacher path from class to printable paper.
 */
export function HowItWorks() {
  return (
    <section className="bg-neutral-0 py-16 sm:py-20 dark:bg-neutral-50">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <Typography variant="h2">How it works</Typography>
          <Typography variant="body" className="mt-3 text-neutral-600">
            Three steps from your class list to a print-ready paper.
          </Typography>
        </div>

        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.Icon;
            return (
              <li key={step.id}>
                <Card className="h-full border-neutral-200">
                  <p className="text-caption font-semibold tracking-wide text-primary-700 uppercase">
                    Step {index + 1}
                  </p>
                  <div className="mt-3 mb-4 flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-primary-50 text-primary-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <Typography variant="h5" as="h3">
                    {step.title}
                  </Typography>
                  <Typography variant="bodySmall" className="mt-2 leading-relaxed">
                    {step.body}
                  </Typography>
                </Card>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
