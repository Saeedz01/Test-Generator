"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { FileDown, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
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
  selectSelectedChapterCount,
  selectSelectedClass,
  selectSelectedQuestionCount,
  selectSelectedQuestionsList,
  selectTotalMarks,
  toggleQuestion,
} from "@/store/selectionSlice";
import { cn } from "@/utils";
import { buildTestPaperHtml } from "../utils/buildTestPaperHtml";
import { generatePdf } from "../utils/generatePdf";
import { applyMarksConfig } from "../utils/testSettingsStorage";
import { saveGeneratedPaper } from "../utils/savedPapersStorage";
import { GenerateTestModal } from "../GenerateTestModal";
import { TestPaperPreview } from "./TestPaperPreview";
import { TestSummaryList } from "./TestSummaryList";

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
  const chapterCount = useSelector(selectSelectedChapterCount);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [printMeta, setPrintMeta] = useState(null);

  const questionsHref =
    schoolClass && book && chapter
      ? ROUTES.chapterQuestions(schoolClass.id, book.id, chapter.id)
      : ROUTES.CLASSES;

  const ordered = [...questions].sort((a, b) => {
    const order = { mcq: 0, short: 1, long: 2 };
    return (order[a.type] ?? 9) - (order[b.type] ?? 9);
  });

  const handleConfirmSettings = (settings) => {
    const { scored, totalMarks } = applyMarksConfig(ordered, settings);
    const meta = {
      instituteName: settings.lastInstitute,
      className: schoolClass?.name,
      bookName: book?.name,
      chapterName:
        chapterCount > 1
          ? `${chapterCount} chapters`
          : chapter?.name,
      timeAllowed: settings.timeAllowed,
      totalMarks,
      copiesPerPage: settings.copiesPerPage || 1,
      headingFontSize: settings.headingFontSize,
      subtextFontSize: settings.subtextFontSize,
    };

    setPrintMeta({ meta, questions: scored });
    setPreviewHtml(buildTestPaperHtml(meta, scored, { autoPrint: false }));
    setSettingsOpen(false);
    saveGeneratedPaper({ meta, questions: scored });
    toast.success("Paper saved on this device.");
  };

  const handlePrint = () => {
    if (!printMeta) return;
    const result = generatePdf(printMeta.meta, printMeta.questions);
    if (!result.ok) {
      toast.error(result.error || "Could not generate PDF.");
      return;
    }
    toast.success(
      "Print dialog opened — turn off “Headers and footers” to hide date/URL, then Save as PDF.",
    );
  };

  if (count === 0) {
    return (
      <EmptyState
        title="No questions selected"
        description="Go back to a chapter and select questions to build your paper."
        action={
          <Link
            href={questionsHref}
            className={cn(buttonVariants({ variant: "primary", size: "md" }))}
          >
            {schoolClass && book && chapter
              ? "Back to questions"
              : "Browse classes"}
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

      {(book || chapter || chapterCount > 1) && (
        <p className="text-small text-neutral-600">
          {book?.name}
          {chapterCount > 1
            ? ` · ${chapterCount} chapters`
            : chapter
              ? ` · ${chapter.name}`
              : ""}
        </p>
      )}

      <TestSummaryList
        questions={ordered}
        onRemove={(question) => dispatch(toggleQuestion(question))}
      />

      {previewHtml ? (
        <TestPaperPreview
          html={previewHtml}
          onPrint={handlePrint}
          onDismiss={() => {
            setPreviewHtml("");
            setPrintMeta(null);
          }}
        />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => {
            dispatch(clearTest());
            setPreviewHtml("");
            setPrintMeta(null);
            toast.success("Selection cleared.");
          }}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Clear test
        </Button>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={questionsHref}
            className={cn(
              buttonVariants({ variant: "outline", size: "md" }),
              "w-full sm:w-auto",
            )}
          >
            Back to questions
          </Link>
          <Button
            variant="primary"
            className="w-full sm:w-auto"
            onClick={() => setSettingsOpen(true)}
          >
            <FileDown className="size-4" aria-hidden="true" />
            {previewHtml ? "Update preview" : "Preview paper"}
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
