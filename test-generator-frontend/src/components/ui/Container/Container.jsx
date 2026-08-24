import { cva } from "class-variance-authority";
import { cn } from "@/utils";

export const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-2xl",
      md: "max-w-3xl",
      lg: "max-w-5xl",
      xl: "max-w-6xl",
      full: "max-w-7xl",
      prose: "max-w-3xl",
    },
  },
  defaultVariants: {
    size: "xl",
  },
});

/**
 * Responsive content width constraint.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {"sm"|"md"|"lg"|"xl"|"full"|"prose"} [props.size]
 * @param {string} [props.className]
 * @param {"div"|"main"|"section"|"article"} [props.as]
 */
export function Container({
  children,
  size = "xl",
  className,
  as: Comp = "div",
  ...props
}) {
  return (
    <Comp className={cn(containerVariants({ size }), className)} {...props}>
      {children}
    </Comp>
  );
}
