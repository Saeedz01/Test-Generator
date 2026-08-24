import { cva } from "class-variance-authority";
import { cn } from "@/utils";

export const skeletonVariants = cva(
  "animate-pulse rounded-[var(--radius-md)] bg-neutral-200/80",
  {
    variants: {
      rounded: {
        default: "rounded-[var(--radius-md)]",
        sm: "rounded-[var(--radius-sm)]",
        lg: "rounded-[var(--radius-lg)]",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      rounded: "default",
    },
  },
);

/**
 * Placeholder shimmer for loading content layouts.
 *
 * @param {Object} props
 * @param {string|number} [props.width]
 * @param {string|number} [props.height]
 * @param {"default"|"sm"|"lg"|"full"|"none"} [props.rounded]
 * @param {string} [props.className]
 */
export function Skeleton({
  width,
  height,
  rounded = "default",
  className,
  style,
  ...props
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(skeletonVariants({ rounded }), className)}
      style={{
        width: width ?? undefined,
        height: height ?? undefined,
        ...style,
      }}
      {...props}
    />
  );
}
