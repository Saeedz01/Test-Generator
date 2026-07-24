"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { FileDown, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Heading,
  buttonVariants,
} from "@/components/ui";
import { ROUTES } from "@/constants";
import {
  clearTest,
  selectSelectedBook,
  selectSelectedChapter,
  selectSelectedClass,
  selectSelectedQuestionCount,
  selectSelectedQuestionsList,
  selectTotalMarks,
  toggleQuestion,
} from "@/store/selectionSlice";
import { cn } from "@/utils";
import { generatePdf } from "../utils/generatePdf";
import { applyMarksConfig } from "../utils/testSettingsStorage";
import { GenerateTestModal } from "./GenerateTestModal";

const TYPE_LABEL = {
  mcq: "MCQ",
  short: "Short",
  long: "Long",
};

/**
 * Test summary — selected questions, totals, and PDF generation.
 */
export function TestSummary() {
  const dispatch = useDispatch();
  const schoolClass = useSelector(selectSelectedClass);
  const book = useSelector(selectSelectedBook);
  const chapter = useSelector(selectSelectedChapter);
  const questions = useSelector(selectSelectedQuestionsList);
  const count = useSelector(selectSelectedQuestionCount);
  const marks = useSelector(selectTotalMarks);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const ordered = [...questions].sort((a, b) => {
    const order = { mcq: 0, short: 1, long: 2 };
    return (order[a.type] ?? 9) - (order[b.type] ?? 9);
  });

  const handleConfirmSettings = (settings) => {
    const { scored, totalMarks } = applyMarksConfig(ordered, settings);

    const result = generatePdf(
      {
        instituteName: settings.lastInstitute,
        className: schoolClass?.name,
        bookName: book?.name,
        chapterName: chapter?.name,
        timeAllowed: settings.timeAllowed,
        totalMarks,
        copiesPerPage: settings.copiesPerPage || 1,
        headingFontSize: settings.headingFontSize,
        subtextFontSize: settings.subtextFontSize,
      },
      scored,
    );

    setSettingsOpen(false);

    if (!result.ok) {
      toast.error(result.error || "Could not generate PDF.");
      return;
    }
    toast.success(
      "Print dialog opened — turn off “Headers and footers” to hide date/URL, then Save as PDF.",
    );  };

  if (count === 0) {
    return (
      <EmptyState
        title="No questions selected"
        description="Go back to a chapter and select questions to build your paper."
        action={
          <Link
            href={ROUTES.CLASSES}
            className={cn(buttonVariants({ variant: "primary", size: "md" }))}
          >
            Browse classes
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Heading level="h1">Test Summary</Heading>
        <p className="mt-2 text-body text-neutral-600">
          Review your selection, then set marks and time before generating the
          paper.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-h3 font-semibold text-primary-700">{count}</p>
          <p className="text-caption text-neutral-500">Questions</p>
        </Card>
        <Card className="text-center">
          <p className="text-h3 font-semibold text-primary-700">{marks}</p>
          <p className="text-caption text-neutral-500">Bank marks</p>
        </Card>
        <Card className="text-center">
          <p className="text-h5 font-semibold text-neutral-900">
            {schoolClass?.name ?? "—"}
          </p>
          <p className="text-caption text-neutral-500">Class</p>
        </Card>
      </div>

      {(book || chapter) && (
        <p className="text-small text-neutral-600">
          {book?.name}
          {chapter ? ` · ${chapter.name}` : ""}
        </p>
      )}

      <Card padded={false} className="overflow-hidden">
        <ul className="divide-y divide-neutral-100">
          {ordered.map((question, index) => (
            <li
              key={question.id}
              className="flex items-start justify-between gap-3 px-4 py-3 sm:px-5"
            >
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-caption font-semibold text-neutral-400">
                    {index + 1}.
                  </span>
                  <Badge variant="outline">{TYPE_LABEL[question.type]}</Badge>
                  <span className="text-caption font-medium text-primary-700">
                    {question.marks} marks
                  </span>
                </div>
                <p className="text-small text-neutral-800">{question.statement}</p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(toggleQuestion(question))}
                className="shrink-0 text-caption font-medium text-neutral-500 transition-colors duration-150 hover:text-error-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            dispatch(clearTest());
            toast.success("Selection cleared.");
          }}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Clear test
        </Button>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={
              schoolClass && book && chapter
                ? ROUTES.chapterQuestions(schoolClass.id, book.id, chapter.id)
                : ROUTES.CLASSES
            }
            className={cn(buttonVariants({ variant: "outline", size: "md" }))}
          >
            Back to questions
          </Link>
          <Button variant="primary" onClick={() => setSettingsOpen(true)}>
            <FileDown className="size-4" aria-hidden="true" />
            Generate PDF
          </Button>
        </div>
      </div>

      <GenerateTestModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        questions={ordered}
        defaultClassName={schoolClass?.name || ""}
        onConfirm={handleConfirmSettings}
      />
    </div>
  );
}
