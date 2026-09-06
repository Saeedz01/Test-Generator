import { Container, Typography } from "@/components/ui";
import { homeStats } from "@/data/home";

/**
 * Honest coverage note — no dummy counts on the public homepage.
 */
export function Statistics() {
  return (
    <section className="bg-neutral-0 py-16 sm:py-20">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Typography variant="h2">Built around your school</Typography>
          <Typography variant="body" className="mt-3 text-neutral-600">
            Coverage grows as admins add classes, books, and questions. What you
            see in the library is what you can put on a paper.
          </Typography>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4 lg:gap-4">
          {homeStats.map((stat) => (
            <li key={stat.id} className="text-center">
              <Typography
                variant="h4"
                as="p"
                align="center"
                className="text-primary-700"
              >
                {stat.value}
              </Typography>
              <Typography
                variant="caption"
                align="center"
                className="mt-1 uppercase tracking-[0.08em] text-neutral-500"
              >
                {stat.label}
              </Typography>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
