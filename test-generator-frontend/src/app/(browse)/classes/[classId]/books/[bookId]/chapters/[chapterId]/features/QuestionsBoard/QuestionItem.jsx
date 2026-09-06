"use client";

import { useDispatch, useSelector } from "react-redux";
import { Badge, Card, Checkbox } from "@/components/ui";
import {
  selectIsQuestionSelected,
  toggleQuestion,
} from "@/store/selectionSlice";
import { cn } from "@/utils";

const TYPE_LABEL = {
  mcq: "MCQ",
  short: "Short",
  long: "Long",
};

/**
 * Single selectable question row — the whole card toggles selection.
 */
export function QuestionItem({ question }) {
  const dispatch = useDispatch();
  const selected = useSelector(selectIsQuestionSelected(question.id));

  const toggle = () => dispatch(toggleQuestion(question));

  return (
    <Card
      padded={false}
      selected={selected}
      className={cn(
        "cursor-pointer p-4 transition-[border-color,background-color,transform] duration-150",
        "hover:border-neutral-300",
      )}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      }}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      aria-label={`Select question: ${question.statement}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Checkbox
            checked={selected}
            onChange={toggle}
            aria-hidden="true"
            tabIndex={-1}
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={question.type === "mcq" ? "info" : "default"}>
              {TYPE_LABEL[question.type] ?? question.type}
            </Badge>
            {question.difficulty ? (
              <Badge variant="outline">{question.difficulty}</Badge>
            ) : null}
            {question.marks != null ? (
              <span className="text-caption font-semibold text-primary-700">
                {question.marks} {question.marks === 1 ? "mark" : "marks"}
              </span>
            ) : null}
          </div>
          <p className="text-small leading-relaxed break-words text-neutral-900 sm:text-body">
            {question.statement}
          </p>
          {question.type === "mcq" && Array.isArray(question.options) ? (
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {question.options.map((option, index) => (
                <li
                  key={`${question.id}-opt-${index}`}
                  className="rounded-[var(--radius-sm)] bg-neutral-50 px-2.5 py-1.5 text-caption text-neutral-600"
                >
                  <span className="mr-1.5 font-semibold text-neutral-500">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
