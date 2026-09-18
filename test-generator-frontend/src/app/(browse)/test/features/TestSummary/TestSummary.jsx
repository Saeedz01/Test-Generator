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
import { downloadPdfFile, generatePdf } from "../utils/generatePdf";
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
    const sourceQuestions =
      ordered.length > 0 ? ordered : (printMeta?.questions ?? []);
    if (!sourceQuestions.length) return;

    const sourceChapterCount = new Set(
      sourceQuestions.map((q) => q.chapterId).filter(Boolean),
    ).size;
    const { scored, totalMarks } = applyMarksConfig(sourceQuestions, settings);
    const meta = {
      instituteName: settings.lastInstitute,
      className: schoolClass?.name,
      bookName: book?.name,
      chapterName:
        sourceChapterCount > 1
          ? `${sourceChapterCount} chapters`
          : chapter?.name,
      timeAllowed: settings.timeAllowed,
      totalMarks,
      copiesPerPage: settings.copiesPerPage || 1,
      headingFontSize: settings.headingFontSize,
      subtextFontSize: settings.subtextFontSize,
      paperLanguage: settings.paperLanguage || "en",
      showPaperHeader: settings.showPaperHeader !== false,
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
    // Paper is finalized — clear selection so chapter visits start fresh
    dispatch(clearTest());
    toast.success(
      "Print dialog opened — turn off “Headers and footers” to hide date/URL.",
    );
  };

  const handleDownload = async () => {
    if (!printMeta) return;
    const result = await downloadPdfFile(printMeta.meta, printMeta.questions);
    if (!result.ok) {
      toast.error(result.error || "Could not download PDF.");
      return;
    }
    // Paper is finalized — clear selection so chapter visits start fresh
    dispatch(clearTest());
    toast.success("PDF downloaded.");
  };

  const previewQuestions = printMeta?.questions ?? ordered;
  const displayCount = previewQuestions.length;
  const displayMarks = printMeta?.meta?.totalMarks ?? marks;

  if (count === 0 && !previewHtml) {
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
          <p className="text-h3 font-semibold text-primary-700">{displayCount}</p>
          <p className="text-caption text-neutral-500">Questions</p>
        </Card>
        <Card className="text-center">
          <p className="text-h3 font-semibold text-primary-700">{displayMarks}</p>
          <p className="text-caption text-neutral-500">
            {printMeta ? "Total marks" : "Bank marks"}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-h5 font-semibold text-neutral-900">
            {schoolClass?.name ?? "—"}
          </p>
          <p className="text-caption text-neutral-500">Class</p>
        </Card>
      </div>

      {(book || chapter || chapterCount > 1 || printMeta) && (
        <p className="text-small text-neutral-600">
          {book?.name}
          {printMeta?.meta?.chapterName
            ? ` · ${printMeta.meta.chapterName}`
            : chapterCount > 1
              ? ` · ${chapterCount} chapters`
              : chapter
                ? ` · ${chapter.name}`
                : ""}
        </p>
      )}

      {previewHtml ? (
        <TestPaperPreview
          html={previewHtml}
          onPrint={handlePrint}
          onDownload={handleDownload}
          onDismiss={() => {
            setPreviewHtml("");
            setPrintMeta(null);
          }}
        />
      ) : (
        <TestSummaryList
          questions={ordered}
          onRemove={(question) => dispatch(toggleQuestion(question))}
        />
      )}

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
            {previewHtml ? "Update preview" : "Next"}
          </Button>
        </div>
      </div>

      <GenerateTestModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        questions={previewQuestions}
        defaultClassName={schoolClass?.name || ""}
        onConfirm={handleConfirmSettings}
      />
    </div>
  );
}
