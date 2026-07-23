import Link from "next/link";
import { buttonVariants, Container, Heading } from "@/components/ui";
import { ROUTES } from "@/constants";
import { homeQuote } from "@/data/home";
import { cn } from "@/utils";
import { HeroArtwork } from "./HeroArtwork";
import { HeroDivider } from "./HeroDivider";

/**
 * Full-bleed interactive hero — brand, quote, CTAs, and decorative artwork.
 */
export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary-50 via-neutral-0 to-info-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -left-16 size-72 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-20 size-80 rounded-full bg-info-100/60 blur-3xl" />
        <div className="absolute bottom-24 left-1/3 size-56 rounded-full bg-primary-100/50 blur-3xl" />
        <span className="animate-float absolute top-28 right-[12%] size-3 rounded-full bg-primary-400/50" />
        <span className="animate-float-delayed absolute top-44 right-[22%] size-2 rounded-full bg-info-500/40" />
        <span className="animate-float-slow absolute bottom-40 left-[10%] size-2.5 rounded-full bg-primary-500/35" />
        <span className="animate-float absolute top-[42%] left-[8%] size-1.5 rounded-full bg-neutral-400/40" />
      </div>

      <Container className="relative grid items-center gap-12 pt-14 pb-28 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-36">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex max-w-md items-start gap-2 rounded-[var(--radius-md)] border border-primary-200/80 bg-neutral-0/70 px-3 py-2 text-caption leading-relaxed text-primary-800 shadow-xs backdrop-blur-sm">
            <span className="mt-0.5 text-primary-500" aria-hidden="true">
              ❝
            </span>
            <span>
              {homeQuote.text}
              <span className="mt-1 block font-medium text-neutral-500">
                — {homeQuote.attribution}
              </span>
            </span>
          </p>

          <p className="mb-3 text-small font-semibold tracking-[0.08em] text-primary-700 uppercase">
            Test Generator
          </p>

          <Heading
            level="display"
            className="max-w-lg text-[2.35rem] sm:text-display"
          >
            Build better exams in minutes, not hours
          </Heading>

          <p className="mt-5 max-w-md text-body text-neutral-600">
            A calm, modern workspace for teachers — generate balanced papers
            from chapter-wise MCQs, short, and long questions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={ROUTES.DASHBOARD}
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "sm:min-w-[10.5rem]",
              )}
            >
              Generate Test
            </Link>
            <Link
              href={ROUTES.CLASSES}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-neutral-300 bg-neutral-0/80 sm:min-w-[10.5rem]",
              )}
            >
              Explore Classes
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <HeroArtwork />
        </div>
      </Container>

      <HeroDivider />
    </section>
  );
}
