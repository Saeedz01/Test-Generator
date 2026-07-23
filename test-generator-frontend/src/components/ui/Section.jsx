import { cn } from "@/utils";
import { Container } from "./Container";
import { Heading } from "./Heading";

/**
 * Page / feature section with consistent vertical rhythm.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {import("react").ReactNode} [props.action]
 * @param {"display"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"} [props.headingLevel]
 * @param {boolean} [props.contained] - Wrap content in Container
 * @param {"sm"|"md"|"lg"|"xl"|"full"|"prose"} [props.containerSize]
 * @param {string} [props.className]
 * @param {string} [props.id]
 */
export function Section({
  children,
  title,
  description,
  action,
  headingLevel = "h2",
  contained = true,
  containerSize = "xl",
  className,
  id,
  ...props
}) {
  const header =
    title || description || action ? (
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-2xl space-y-2">
          {title ? <Heading level={headingLevel}>{title}</Heading> : null}
          {description ? (
            <p className="text-body text-neutral-600">{description}</p>
          ) : null}
        </div>
        {action ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {action}
          </div>
        ) : null}
      </div>
    ) : null;

  const body = (
    <>
      {header}
      {children}
    </>
  );

  return (
    <section
      id={id}
      className={cn("w-full py-10 sm:py-14 lg:py-16", className)}
      {...props}
    >
      {contained ? (
        <Container size={containerSize}>{body}</Container>
      ) : (
        body
      )}
    </section>
  );
}
