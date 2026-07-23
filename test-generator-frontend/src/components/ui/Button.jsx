"use client";

import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils";

/**
 * Button variants aligned with design-system tokens.
 * Primary / Secondary / Outline / Ghost / Destructive + size + loading.
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-[var(--radius-button)] font-semibold",
    "transition-[color,background-color,border-color,transform,opacity]",
    "duration-200 ease-[var(--ease-standard)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-primary-500 focus-visible:ring-offset-neutral-0",
    "disabled:pointer-events-none disabled:opacity-45",
    "active:scale-[0.98]",
    "cursor-pointer select-none",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-neutral-0 hover:bg-primary-700 active:bg-primary-800",
        secondary:
          "border border-neutral-200 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300",
        outline:
          "border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100",
        ghost:
          "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200",
        destructive:
          "bg-error-600 text-neutral-0 hover:bg-error-700 active:bg-error-700 focus-visible:ring-error-500",
      },
      size: {
        sm: "h-8 px-3 text-caption",
        md: "h-10 px-4 text-small",
        lg: "h-11 px-5 text-small",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

/**
 * @param {Object} props
 * @param {import("react").ReactNode} [props.children]
 * @param {"primary"|"secondary"|"outline"|"ghost"|"destructive"} [props.variant]
 * @param {"sm"|"md"|"lg"} [props.size]
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.loading]
 * @param {boolean} [props.disabled]
 * @param {"button"|"submit"|"reset"} [props.type]
 * @param {string} [props.className]
 * @param {import("react").ButtonHTMLAttributes<HTMLButtonElement>} [props.rest]
 */
export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading ? (
        <Loader2
          className="size-4 shrink-0 animate-spin"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
}
