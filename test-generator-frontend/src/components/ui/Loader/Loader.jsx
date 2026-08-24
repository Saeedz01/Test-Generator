import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils";

export const loaderVariants = cva("animate-spin text-primary-600", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
      xl: "size-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * Accessible loading spinner.
 *
 * @param {Object} props
 * @param {"sm"|"md"|"lg"|"xl"} [props.size]
 * @param {string} [props.label] - Announced to screen readers
 * @param {boolean} [props.fullPage] - Centers in a min-height region
 * @param {string} [props.className]
 */
export function Loader({
  size = "md",
  label = "Loading",
  fullPage = false,
  className,
  ...props
}) {
  const spinner = (
    <Loader2
      role="status"
      aria-label={label}
      className={cn(loaderVariants({ size }), className)}
      {...props}
    />
  );

  if (!fullPage) {
    return spinner;
  }

  return (
    <div
      className="flex min-h-[12rem] w-full items-center justify-center"
      aria-busy="true"
    >
      {spinner}
      <span className="sr-only">{label}</span>
    </div>
  );
}
