"use client";

import { Heading } from "@/components/ui";
import { QuestionItem } from "./QuestionItem";

/**
 * Grouped list for one question type.
 */
export function QuestionGroup({ title, questions }) {
  if (!questions?.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <Heading level="h3">{title}</Heading>
        <p className="text-caption text-neutral-500">
          {questions.length} {questions.length === 1 ? "item" : "items"}
        </p>
      </div>
      <ul className="space-y-3">
        {questions.map((question) => (
          <li key={question.id}>
            <QuestionItem question={question} />
          </li>
        ))}
      </ul>
    </section>
  );
}
