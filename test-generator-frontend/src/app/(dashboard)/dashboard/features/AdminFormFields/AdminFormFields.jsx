"use client";

import { cn } from "@/utils";

const fieldClass =
  "mt-1.5 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 py-2 text-small text-neutral-900 outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30";

export function Field({ label, children, className }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-caption font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return <input className={fieldClass} {...props} />;
}

export function TextSelect({ children, ...props }) {
  return (
    <select className={fieldClass} {...props}>
      {children}
    </select>
  );
}

export function TextTextarea(props) {
  return <textarea className={cn(fieldClass, "min-h-24 resize-y")} {...props} />;
}
