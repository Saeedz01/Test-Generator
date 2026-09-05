"use client";

import { useDispatch, useSelector } from "react-redux";
import { Heading } from "@/components/ui";
import {
  deselectQuestions,
  selectQuestions,
  selectSelectedQuestionsMap,
} from "@/store/selectionSlice";
import { QuestionItem } from "./QuestionItem";

/**
 * Grouped list for one question type, with select-all / clear.
 */
export function QuestionGroup({ title, questions }) {
  const dispatch = useDispatch();
  const selectedMap = useSelector(selectSelectedQuestionsMap);

  if (!questions?.length) return null;

  const selectedCount = questions.filter((question) =>
    Boolean(selectedMap[question.id]),
  ).length;
  const allSelected = selectedCount === questions.length;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Heading level="h3">{title}</Heading>
        <div className="flex items-center gap-3">
          <p className="text-caption text-neutral-500">
            {questions.length} {questions.length === 1 ? "item" : "items"}
            {selectedCount ? ` · ${selectedCount} selected` : ""}
          </p>
          <button
            type="button"
            className="text-caption font-semibold text-primary-700 transition-colors hover:text-primary-800 disabled:opacity-40"
            disabled={allSelected}
            onClick={() => dispatch(selectQuestions(questions))}
          >
            Select all
          </button>
          <button
            type="button"
            className="text-caption font-semibold text-neutral-600 transition-colors hover:text-neutral-800 disabled:opacity-40"
            disabled={selectedCount === 0}
            onClick={() =>
              dispatch(deselectQuestions(questions.map((item) => item.id)))
            }
          >
            Clear
          </button>
        </div>
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
