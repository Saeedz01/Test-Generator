"use client";

import { Badge } from "@/components/ui";

const TYPE_LABEL = {
  mcq: "MCQ",
  short: "Short",
  long: "Long",
};

function groupQuestionsByChapter(questions) {
  const groups = [];
  const indexByKey = new Map();

  questions.forEach((question) => {
    const key = question.chapterId || question.chapterName || "_";
    if (!indexByKey.has(key)) {
      indexByKey.set(key, groups.length);
      groups.push({
        key,
        label: question.chapterName || "Selected questions",
        questions: [],
      });
    }
    groups[indexByKey.get(key)].questions.push(question);
  });

  return groups;
}

/**
 * Selected questions, grouped by chapter when the paper is mixed.
 */
export function TestSummaryList({ questions, onRemove }) {
  const groups = groupQuestionsByChapter(questions);
  const showHeadings = groups.length > 1;
  let number = 0;

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0">
      {groups.map((group) => (
        <section key={group.key}>
          {showHeadings ? (
            <h3 className="border-b border-neutral-100 bg-neutral-50 px-4 py-2 text-caption font-semibold tracking-wide text-neutral-600 uppercase sm:px-5">
              {group.label}
            </h3>
          ) : null}
          <ul className="divide-y divide-neutral-100">
            {group.questions.map((question) => {
              number += 1;
              return (
                <li
                  key={question.id}
                  className="flex items-start justify-between gap-3 px-4 py-3 sm:px-5"
                >
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-caption font-semibold text-neutral-400">
                        {number}.
                      </span>
                      <Badge variant="outline">{TYPE_LABEL[question.type]}</Badge>
                      <span className="text-caption font-medium text-primary-700">
                        {question.marks} marks
                      </span>
                    </div>
                    <p className="text-small break-words text-neutral-800">
                      {question.statement}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(question)}
                    className="shrink-0 text-caption font-medium text-neutral-500 transition-colors duration-150 hover:text-error-600"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
