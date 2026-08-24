import { cva } from "class-variance-authority";
import { cn } from "@/utils";

export const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-[var(--radius-sm)]",
    "px-2 py-0.5 text-caption font-medium whitespace-nowrap",
    "transition-colors duration-150",
  ],
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-700",
        primary: "bg-primary-50 text-primary-700",
        success: "bg-success-50 text-success-700",
        warning: "bg-warning-50 text-warning-700",
        error: "bg-error-50 text-error-700",
        info: "bg-info-50 text-info-700",
        outline: "border border-neutral-200 bg-transparent text-neutral-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Compact status / category label.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {"default"|"primary"|"success"|"warning"|"error"|"info"|"outline"} [props.variant]
 * @param {string} [props.className]
 */
export function Badge({ children, variant = "default", className, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
