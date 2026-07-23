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
 * Single selectable question row.
 */
export function QuestionItem({ question }) {
  const dispatch = useDispatch();
  const selected = useSelector(selectIsQuestionSelected(question.id));

  return (
    <Card
      padded={false}
      selected={selected}
      className={cn(
        "p-4 transition-[border-color,background-color,transform] duration-150",
        "hover:border-neutral-300",
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={selected}
          onChange={() => dispatch(toggleQuestion(question))}
          aria-label={`Select question: ${question.statement}`}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={question.type === "mcq" ? "info" : "default"}>
              {TYPE_LABEL[question.type] ?? question.type}
            </Badge>
            <Badge variant="outline">{question.difficulty}</Badge>
            <span className="text-caption font-semibold text-primary-700">
              {question.marks} {question.marks === 1 ? "mark" : "marks"}
            </span>
          </div>
          <p className="text-small leading-relaxed text-neutral-900 sm:text-body">
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
