import Link from "next/link";

/**
 * Thin navigation strip back to parent step.
 *
 * @param {{ href: string, label: string }} props
 */
export default function BackBar({ href, label }) {
  return (
    <div
      className="border-b px-6 py-3 text-sm"
      style={{
        backgroundColor: "var(--tg-muted-bg)",
        borderColor: "var(--tg-border)",
        color: "var(--tg-muted-text)",
      }}
    >
      <Link
        href={href}
        className="inline-flex items-center gap-1 font-medium hover:underline"
        style={{ color: "var(--tg-accent)" }}
      >
        ← {label}
      </Link>
    </div>
  );
}
