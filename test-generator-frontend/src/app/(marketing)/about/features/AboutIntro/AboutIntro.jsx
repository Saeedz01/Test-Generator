import Link from "next/link";
import { buttonVariants, Container, Typography } from "@/components/ui";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";
import { aboutIntro, aboutQuestionTypes } from "../aboutData";
import { AboutArtwork } from "./AboutArtwork";
import { AboutDivider } from "./AboutDivider";

/**
 * About hero — editorial intro with paper preview and generate CTAs.
 */
export function AboutIntro() {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        "bg-neutral-50 bg-gradient-to-br from-primary-50 via-neutral-0 to-info-50",
        "dark:bg-neutral-50 dark:bg-none",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden dark:hidden"
      >
        <div className="absolute -top-24 -left-16 size-72 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-20 size-80 rounded-full bg-info-100/60 blur-3xl" />
        <span className="animate-float absolute top-24 right-[14%] size-3 rounded-full bg-primary-400/50" />
        <span className="animate-float-delayed absolute bottom-32 left-[10%] size-2 rounded-full bg-info-500/40" />
      </div>

      <Container
        className={cn(
          "relative grid items-center gap-10 py-14 pb-24 sm:py-16 sm:pb-28",
          "lg:grid-cols-2 lg:gap-14 lg:py-20 lg:pb-32",
        )}
      >
        <div className="max-w-xl">
          <Typography
            variant="label"
            as="p"
            className="mb-3 font-semibold tracking-[0.08em] text-primary-700 uppercase"
          >
            {aboutIntro.eyebrow}
          </Typography>
          <Typography variant="display" className="max-w-lg sm:text-display">
            {aboutIntro.headline}
          </Typography>
          <Typography
            variant="body"
            className="mt-4 max-w-md text-neutral-600"
          >
            {aboutIntro.body}
          </Typography>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Question types">
            {aboutQuestionTypes.map((type) => (
              <li
                key={type.id}
                className="rounded-full border border-primary-200 bg-neutral-0 px-3 py-1 shadow-xs"
              >
                <Typography
                  variant="caption"
                  as="span"
                  className="font-medium text-primary-800"
                >
                  {type.label}
                </Typography>
              </li>
            ))}
          </ul>

          <div className="relative z-20 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`${ROUTES.CLASSES}?start=1`}
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "w-full shadow-xs sm:w-auto sm:min-w-[10.5rem]",
              )}
            >
              Generate Test
            </Link>
            <Link
              href={ROUTES.BANNER}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full border-2 border-primary-700 bg-neutral-0 text-primary-800 shadow-xs sm:w-auto sm:min-w-[10.5rem]",
              )}
            >
              Banner Designer
            </Link>
          </div>
        </div>

        <div className="relative">
          <AboutArtwork />
        </div>
      </Container>

      <AboutDivider />
    </section>
  );
}
