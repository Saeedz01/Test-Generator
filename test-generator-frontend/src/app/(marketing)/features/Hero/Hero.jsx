import Link from "next/link";
import { buttonVariants, Container, Typography } from "@/components/ui";
import { ROUTES } from "@/constants";
import { homeQuote } from "@/data/home";
import { cn } from "@/utils";
import { HeroArtwork } from "./HeroArtwork";
import { HeroDivider } from "./HeroDivider";

/**
 * Full-bleed interactive hero — capped to one viewport (below sticky header)
 * so the asymmetrical bottom curve is visible without scrolling.
 */
export function Hero() {
  return (
    <section
      className={cn(
        "relative isolate flex flex-col overflow-hidden",
        "h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)]",
        "bg-gradient-to-br from-primary-50 via-neutral-0 to-info-50",
      )}
    >
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

      <Container
        className={cn(
          "relative grid min-h-0 flex-1 items-center",
          "gap-6 py-8 pb-20 sm:gap-8 sm:py-10 sm:pb-24",
          "lg:grid-cols-2 lg:gap-12 lg:py-12 lg:pb-28",
        )}
      >
        <div className="max-w-xl">
          <Typography
            variant="caption"
            as="p"
            className="mb-4 inline-flex max-w-md items-start gap-2 rounded-[var(--radius-md)] border border-primary-200/80 bg-neutral-0/70 px-3 py-2 leading-relaxed text-primary-800 shadow-xs backdrop-blur-sm"
          >
            <span className="mt-0.5 text-primary-500" aria-hidden="true">
              ❝
            </span>
            <span>
              {homeQuote.text}
              <span className="mt-1 block font-medium text-neutral-500">
                — {homeQuote.attribution}
              </span>
            </span>
          </Typography>

          <Typography
            variant="label"
            as="p"
            className="mb-2 font-semibold tracking-[0.08em] text-primary-700 uppercase"
          >
            Test Generator
          </Typography>

          <Typography variant="display" className="max-w-lg sm:text-display">
            Build better exams in minutes, not hours
          </Typography>

          <Typography
            variant="bodySmall"
            as="p"
            className="mt-3 max-w-md sm:mt-4 sm:text-body"
          >
            A calm, modern workspace for teachers — generate balanced papers
            from chapter-wise MCQs, short, and long questions.
          </Typography>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              href={ROUTES.CLASSES}
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

        <div className="relative mx-auto hidden w-full max-w-md min-[480px]:block lg:max-w-none">
          <div className="mx-auto flex h-[min(42vh,22rem)] w-full items-center justify-center lg:h-[min(52vh,28rem)]">
            <HeroArtwork />
          </div>
        </div>
      </Container>

      <HeroDivider />
    </section>
  );
}
