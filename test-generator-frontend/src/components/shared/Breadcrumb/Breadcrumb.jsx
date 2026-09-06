import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Hierarchical path for browse pages (Home / Class / Book / Chapter).
 *
 * @param {Object} props
 * @param {{ label: string, href?: string }[]} props.items
 */
export function Breadcrumb({ items }) {
  if (!items?.length) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-caption text-neutral-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
              {index > 0 ? (
                <ChevronRight
                  className="size-3.5 shrink-0 text-neutral-400"
                  aria-hidden="true"
                />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="break-words font-medium text-neutral-600 transition-colors duration-150 hover:text-primary-700"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="break-words font-semibold text-neutral-900"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
