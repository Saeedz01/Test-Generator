import Link from "next/link";

/**
 * @param {{ items: { label: string, href?: string }[] }} props
 */
export default function BreadcrumbTrail({ items }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b px-6 py-3 text-sm"
      style={{
        backgroundColor: "var(--tg-surface)",
        borderColor: "var(--tg-border)",
        color: "var(--tg-muted-text)",
      }}
    >
      <ol className="mx-auto flex max-w-6xl flex-wrap gap-2">
        {items.map((item, idx) => {
          const last = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {idx > 0 && (
                <span aria-hidden className="text-zinc-400 dark:text-zinc-600">
                  /
                </span>
              )}
              {last || !item.href ? (
                <span
                  className={last ? "font-medium text-zinc-900 dark:text-zinc-100" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium hover:underline"
                  style={{ color: "var(--tg-accent)" }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
