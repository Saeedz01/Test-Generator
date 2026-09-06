import Link from "next/link";
import { buttonVariants, Container, Typography } from "@/components/ui";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";
import { aboutCta } from "../aboutData";

/**
 * Closing call-to-action band — local to About so this route stays self-contained.
 */
export function AboutCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 py-16 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 right-10 size-56 rounded-full bg-primary-500/40 blur-3xl" />
        <div className="absolute -bottom-20 left-8 size-64 rounded-full bg-info-500/20 blur-3xl" />
      </div>

      <Container className="relative text-center">
        <Typography variant="h2" className="text-white">
          {aboutCta.headline}
        </Typography>
        <Typography
          variant="body"
          className="mx-auto mt-4 max-w-xl text-primary-100"
        >
          {aboutCta.body}
        </Typography>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={ROUTES.CLASSES}
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "w-full border-transparent bg-white text-primary-800 hover:bg-primary-50 sm:w-auto sm:min-w-[10.5rem]",
            )}
          >
            {aboutCta.action}
          </Link>
          <Link
            href={ROUTES.BANNER}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto sm:min-w-[10.5rem]",
            )}
          >
            Banner Designer
          </Link>
        </div>
      </Container>
    </section>
  );
}
