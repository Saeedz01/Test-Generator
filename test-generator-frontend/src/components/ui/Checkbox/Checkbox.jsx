"use client";

import { useId } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/utils";

/**
 * Accessible checkbox with custom visual aligned to the design system.
 *
 * @param {Object} props
 * @param {string} [props.id]
 * @param {string} [props.label]
 * @param {string} [props.description]
 * @param {boolean} [props.checked]
 * @param {boolean} [props.defaultChecked]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.indeterminate]
 * @param {(event: import("react").ChangeEvent<HTMLInputElement>) => void} [props.onChange]
 * @param {string} [props.className]
 * @param {string} [props.labelClassName]
 */
export function Checkbox({
  id,
  label,
  description,
  checked,
  defaultChecked,
  disabled = false,
  indeterminate = false,
  onChange,
  className,
  labelClassName,
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "group inline-flex max-w-full cursor-pointer items-start gap-3",
        disabled && "cursor-not-allowed opacity-45",
        className,
      )}
    >
      <span className="relative mt-0.5 inline-flex size-5 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
          aria-describedby={descriptionId}
          aria-checked={indeterminate ? "mixed" : undefined}
          className="peer sr-only"
          ref={(node) => {
            if (node) {
              node.indeterminate = Boolean(indeterminate);
            }
          }}
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none flex size-5 items-center justify-center",
            "rounded-[var(--radius-sm)] border border-neutral-300 bg-neutral-0",
            "transition-[background-color,border-color,box-shadow] duration-150",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2",
            "peer-checked:border-primary-600 peer-checked:bg-primary-600",
            "peer-checked:[&_svg]:opacity-100",
            "peer-disabled:border-neutral-200 peer-disabled:bg-neutral-100",
            indeterminate && "border-primary-600 bg-primary-600 [&_svg]:opacity-100",
          )}
        >
          {indeterminate ? (
            <Minus className="size-3.5 text-white opacity-0" strokeWidth={3} />
          ) : (
            <Check className="size-3.5 text-white opacity-0" strokeWidth={3} />
          )}
        </span>
      </span>

      {(label || description) && (
        <span className="flex min-w-0 flex-col gap-0.5">
          {label ? (
            <span
              className={cn(
                "text-small font-medium text-neutral-900",
                labelClassName,
              )}
            >
              {label}
            </span>
          ) : null}
          {description ? (
            <span id={descriptionId} className="text-caption text-neutral-500">
              {description}
            </span>
          ) : null}
        </span>
      )}
    </label>
  );
}
