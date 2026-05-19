"use client";

/**
 * @param {{ checked: boolean, onToggle: () => void, accentNumber: number, label: string, children?: import('react').ReactNode }} props
 */
export default function QuestionBlock({
  checked,
  onToggle,
  accentNumber,
  label,
  children,
}) {
  return (
    <label
      className="flex cursor-pointer gap-3 rounded-lg border p-4 text-sm leading-relaxed hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
      style={{ borderColor: "var(--tg-border)", backgroundColor: "var(--tg-surface)" }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-1 h-4 w-4 shrink-0 rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-600"
        aria-label={`Toggle question ${accentNumber}`}
      />
      <span className="min-w-[1.5rem] shrink-0 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Q{accentNumber}
      </span>
      <span className="flex-1">
        <span
          className="mb-1 inline-block rounded px-2 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: "var(--tg-muted-bg)",
            color: "var(--tg-muted-text)",
          }}
        >
          {label}
        </span>
        <span className="mt-2 block text-zinc-900 dark:text-zinc-100">{children}</span>
      </span>
    </label>
  );
}
