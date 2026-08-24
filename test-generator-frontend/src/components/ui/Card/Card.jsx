import { cn } from "@/utils";

/**
 * Surface container with optional hover / selected states.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {boolean} [props.hoverable]
 * @param {boolean} [props.selected]
 * @param {boolean} [props.padded]
 * @param {string} [props.className]
 * @param {"div"|"article"|"section"|"li"} [props.as]
 */
export function Card({
  children,
  className,
  hoverable = false,
  selected = false,
  padded = true,
  as: Comp = "div",
  ...props
}) {
  return (
    <Comp
      data-selected={selected || undefined}
      className={cn(
        "rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0",
        "transition-[border-color,box-shadow,transform,background-color]",
        "duration-200 ease-[var(--ease-standard)]",
        padded && "p-6",
        hoverable &&
          "hover:-translate-y-px hover:border-neutral-300 hover:shadow-xs",
        selected && "border-primary-400 bg-primary-50",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/**
 * @param {{ children: import("react").ReactNode, className?: string }} props
 */
export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * @param {{ children: import("react").ReactNode, className?: string }} props
 */
export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn(
        "text-h5 font-semibold tracking-[-0.01em] text-neutral-900",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * @param {{ children: import("react").ReactNode, className?: string }} props
 */
export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn("text-small text-neutral-600", className)} {...props}>
      {children}
    </p>
  );
}

/**
 * @param {{ children: import("react").ReactNode, className?: string }} props
 */
export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("text-body text-neutral-700", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * @param {{ children: import("react").ReactNode, className?: string }} props
 */
export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "mt-4 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
