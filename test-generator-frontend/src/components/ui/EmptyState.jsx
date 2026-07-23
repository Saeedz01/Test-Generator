import { Inbox } from "lucide-react";
import { cn } from "@/utils";

/**
 * Empty list / no-results placeholder.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} [props.icon]
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import("react").ReactNode} [props.action]
 * @param {string} [props.className]
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex w-full flex-col items-center justify-center px-6 py-12 text-center sm:py-16",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mb-4 flex size-12 items-center justify-center rounded-[var(--radius-xl)]",
          "border border-neutral-200 bg-neutral-50 text-neutral-500",
        )}
        aria-hidden={icon ? undefined : true}
      >
        {icon ?? <Inbox className="size-5" aria-hidden="true" />}
      </div>

      <h3 className="text-h5 font-semibold text-neutral-900">{title}</h3>

      {description ? (
        <p className="mt-2 max-w-sm text-small text-neutral-600">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
