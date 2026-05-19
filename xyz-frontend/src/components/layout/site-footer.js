import Link from "next/link";

import { EXTERNAL_LINKS, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t py-10 text-sm"
      style={{
        borderColor: "var(--tg-border)",
        backgroundColor: "var(--tg-surface)",
        color: "var(--tg-muted-text)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl space-y-2">
          <p className="text-base font-semibold text-zinc-900 dark:text-white">{SITE_NAME}</p>
          <p>
            Generated chapters follow widely circulated Punjab textbook scaffolding. Validate wording, numbering, and
            retired units against the edition your school adopts via{" "}
            <Link
              href={EXTERNAL_LINKS.pctb}
              className="font-semibold text-[color:var(--tg-accent)] underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              pctb.pk
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          <Link
            href={EXTERNAL_LINKS.taleemCityCatalog}
            className="transition hover:text-[color:var(--tg-accent)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Punjab PDF catalogs
          </Link>
          <p>
            © {year} · Practice UI only
          </p>
        </div>
      </div>
    </footer>
  );
}
