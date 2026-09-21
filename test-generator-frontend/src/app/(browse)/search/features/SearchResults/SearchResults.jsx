"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, FileQuestion, GraduationCap, Layers, Search } from "lucide-react";
import { Badge, Card, EmptyState, Heading, Loader } from "@/components/ui";
import { ROUTES } from "@/constants";
import {
  SEARCH_MIN_LENGTH,
  useSearchLibraryQuery,
} from "@/services/api/search.api";

const DEBOUNCE_MS = 300;

const TYPE_LABEL = { mcq: "MCQ", short: "Short", long: "Long" };

function ResultGroup({ title, icon: Icon, items, children }) {
  if (!items.length) return null;
  return (
    <section className="space-y-2">
      <h2 className="flex items-center gap-2 text-caption font-semibold tracking-wide text-neutral-500 uppercase">
        <Icon className="size-4 text-primary-700" aria-hidden="true" />
        {title}
        <span className="font-normal text-neutral-400">({items.length})</span>
      </h2>
      <Card padded={false} className="overflow-hidden">
        <ul className="divide-y divide-neutral-100">{children}</ul>
      </Card>
    </section>
  );
}

function ResultLink({ href, title, subtitle, badge }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
      >
        <span className="min-w-0">
          <span className="block text-small font-medium text-neutral-900">
            {title}
          </span>
          {subtitle ? (
            <span className="mt-0.5 block text-caption text-neutral-500">
              {subtitle}
            </span>
          ) : null}
        </span>
        {badge ? <Badge variant="outline">{badge}</Badge> : null}
      </Link>
    </li>
  );
}

/**
 * Library-wide search across classes, books, chapters and questions
 * (English and Urdu). Archived classes and deleted books never appear.
 */
export function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTerm = searchParams.get("q") ?? "";
  const [term, setTerm] = useState(initialTerm);
  const [debounced, setDebounced] = useState(initialTerm.trim());

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [term]);

  // Keep the URL shareable without adding a history entry per keystroke.
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (debounced === current) return;
    router.replace(
      debounced ? `${ROUTES.SEARCH}?q=${encodeURIComponent(debounced)}` : ROUTES.SEARCH,
      { scroll: false },
    );
  }, [debounced, router, searchParams]);

  const canSearch = debounced.length >= SEARCH_MIN_LENGTH;
  const { data, isFetching, isError, error } = useSearchLibraryQuery(debounced, {
    skip: !canSearch,
  });

  const total = useMemo(
    () =>
      data
        ? data.classes.length +
          data.books.length +
          data.chapters.length +
          data.questions.length
        : 0,
    [data],
  );

  return (
    <div className="space-y-6">
      <div>
        <Heading level="h1">Search the library</Heading>
        <p className="mt-2 text-body text-neutral-600">
          Find classes, books, chapters and questions — in English or Urdu.
        </p>
      </div>

      <label className="relative block w-full max-w-xl">
        <span className="sr-only">Search the library</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={term}
          autoFocus
          onChange={(event) => setTerm(event.target.value)}
          placeholder="e.g. photosynthesis, Motion, 9th…"
          className="h-11 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 pr-4 pl-10 text-small text-neutral-900 placeholder:text-neutral-400 focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:outline-none"
        />
      </label>

      {!canSearch ? (
        <p className="text-small text-neutral-500">
          Type at least {SEARCH_MIN_LENGTH} characters to search.
        </p>
      ) : isFetching ? (
        <div className="flex items-center gap-2 text-small text-neutral-500">
          <Loader size="sm" />
          Searching…
        </div>
      ) : isError ? (
        <EmptyState
          title="Search is unavailable"
          description={
            error?.data?.message ||
            "The library could not be searched right now. Check your connection and try again."
          }
        />
      ) : total === 0 ? (
        <EmptyState
          title={`No matches for “${debounced}”`}
          description="Try a shorter term, a different spelling, or browse the classes instead."
        />
      ) : (
        <div className="space-y-6">
          <ResultGroup
            title="Classes"
            icon={GraduationCap}
            items={data.classes}
          >
            {data.classes.map((item) => (
              <ResultLink
                key={item.id}
                href={ROUTES.classBooks(item.id)}
                title={item.name}
                subtitle="Browse books"
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Books" icon={BookOpen} items={data.books}>
            {data.books.map((item) => (
              <ResultLink
                key={item.id}
                href={ROUTES.bookChapters(item.classId, item.id)}
                title={item.name}
                subtitle={item.className}
              />
            ))}
          </ResultGroup>

          <ResultGroup title="Chapters" icon={Layers} items={data.chapters}>
            {data.chapters.map((item) => (
              <ResultLink
                key={item.id}
                href={ROUTES.chapterQuestions(
                  item.classId,
                  item.bookId,
                  item.id,
                )}
                title={item.name}
                subtitle={`${item.className} · ${item.bookName}`}
              />
            ))}
          </ResultGroup>

          <ResultGroup
            title="Questions"
            icon={FileQuestion}
            items={data.questions}
          >
            {data.questions.map((item) => (
              <ResultLink
                key={`${item.type}-${item.id}`}
                href={ROUTES.chapterQuestions(
                  item.classId,
                  item.bookId,
                  item.chapterId,
                )}
                title={item.text}
                subtitle={`${item.className} · ${item.bookName} · ${item.chapterName}`}
                badge={TYPE_LABEL[item.type] ?? item.type}
              />
            ))}
          </ResultGroup>
        </div>
      )}
    </div>
  );
}
