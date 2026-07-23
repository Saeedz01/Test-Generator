import Link from "next/link";
import { buttonVariants, Container, Heading } from "@/components/ui";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";

/**
 * Closing call-to-action band.
 */
export function HomeCtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-16 right-10 size-56 rounded-full bg-primary-500/40 blur-3xl" />
        <div className="absolute -bottom-20 left-8 size-64 rounded-full bg-info-500/20 blur-3xl" />
      </div>

      <Container className="relative text-center">
        <Heading level="h2" className="text-neutral-0">
          Ready to generate your next test?
        </Heading>
        <p className="mx-auto mt-4 max-w-xl text-body text-primary-100">
          Open the workspace, pick a class, and assemble a balanced paper in a
          few calm clicks.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href={ROUTES.DASHBOARD}
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "border-transparent bg-neutral-0 text-primary-800 hover:bg-primary-50",
            )}
          >
            Start Generating
          </Link>
        </div>
      </Container>
    </section>
  );
}
