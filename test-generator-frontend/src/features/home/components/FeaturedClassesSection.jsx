import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  Calculator,
  FlaskConical,
  GraduationCap,
  Laptop,
  Palette,
} from "lucide-react";
import { Card, Container, Heading } from "@/components/ui";
import { featuredClasses } from "@/data/home";

const ICON_MAP = {
  graduation: GraduationCap,
  book: BookOpen,
  flask: FlaskConical,
  calculator: Calculator,
  laptop: Laptop,
  briefcase: Briefcase,
  palette: Palette,
};

/**
 * Featured academic tracks / classes grid.
 */
export function FeaturedClassesSection() {
  return (
    <section className="relative z-10 -mt-2 bg-neutral-0 pb-6 pt-4 sm:pb-10">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <Heading level="h2">Featured Classes</Heading>
          <p className="mt-3 text-body text-neutral-600">
            Start from your grade or group — each path includes curated books
            and chapter banks ready for test generation.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredClasses.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? GraduationCap;

            return (
              <li key={item.id} className="min-w-0">
                <Link
                  href={item.href}
                  className="group block h-full rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  <Card
                    hoverable
                    className="h-full cursor-pointer border-neutral-200 transition-[border-color,transform,box-shadow] duration-200 group-hover:-translate-y-px group-hover:border-primary-300"
                  >
                    <div className="mb-4 flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-primary-50 text-primary-700 transition-colors duration-200 group-hover:bg-primary-100">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-h4 font-semibold text-neutral-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-small text-neutral-500">
                      {item.subtitle}
                    </p>
                    <p className="mt-4 text-caption font-medium text-primary-700">
                      {item.booksCount} books
                    </p>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
