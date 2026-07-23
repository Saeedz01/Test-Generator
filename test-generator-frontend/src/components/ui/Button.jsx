"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/utils";
import { buttonVariants } from "./button-variants";

export { buttonVariants };

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
