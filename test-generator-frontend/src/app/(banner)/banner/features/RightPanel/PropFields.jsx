"use client";

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-caption font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

export function NumberField({ label, value, onChange, min, max, step = 1 }) {
  return (
    <Field label={label}>
      <input
        type="number"
        className="mt-1.5 h-9 w-full min-w-0 rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-2 text-small"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </Field>
  );
}
