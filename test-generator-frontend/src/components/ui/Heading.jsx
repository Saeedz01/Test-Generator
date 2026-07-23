import { cva } from "class-variance-authority";
import { cn } from "@/utils";

const headingVariants = cva("font-display text-neutral-900", {
  variants: {
    level: {
      display:
        "text-display font-bold tracking-[-0.03em] leading-[1.15]",
      h1: "text-h1 font-bold tracking-[-0.025em] leading-[1.2]",
      h2: "text-h2 font-semibold tracking-[-0.02em] leading-[1.25]",
      h3: "text-h3 font-semibold tracking-[-0.015em] leading-[1.3]",
      h4: "text-h4 font-semibold tracking-[-0.01em] leading-[1.35]",
      h5: "text-h5 font-semibold tracking-[-0.01em] leading-[1.4]",
      h6: "text-h6 font-semibold leading-[1.4]",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    muted: {
      true: "text-neutral-600",
      false: "text-neutral-900",
    },
  },
  defaultVariants: {
    level: "h2",
    align: "left",
    muted: false,
  },
});

const LEVEL_TAGS = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
};

/**
 * Semantic heading with design-system type scale.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {"display"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"} [props.level] - Visual style
 * @param {"h1"|"h2"|"h3"|"h4"|"h5"|"h6"} [props.as] - Override HTML tag for a11y hierarchy
 * @param {"left"|"center"|"right"} [props.align]
 * @param {boolean} [props.muted]
 * @param {string} [props.className]
 */
export function Heading({
  children,
  level = "h2",
  as,
  align = "left",
  muted = false,
  className,
  ...props
}) {
  const Comp = as ?? LEVEL_TAGS[level] ?? "h2";

  return (
    <Comp
      className={cn(headingVariants({ level, align, muted }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
