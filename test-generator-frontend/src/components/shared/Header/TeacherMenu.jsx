"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, FileText, Plus, RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { buttonVariants } from "@/components/ui";
import { ROUTES } from "@/constants";
import { generatePdf } from "@/app/(browse)/test/features/utils/generatePdf";
import {
  deleteSavedPaper,
  loadSavedPapers,
  paperDateLabel,
  paperLabel,
  subscribeSavedPapers,
} from "@/app/(browse)/test/features/utils/savedPapersStorage";
import { clearSelection, selectSelectedQuestionCount } from "@/store/selectionSlice";
import { cn } from "@/utils";

/**
 * Teacher menu: resume, new test, and locally saved generated papers.
 */
export function TeacherMenu({ layout = "dropdown" }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedCount = useSelector(selectSelectedQuestionCount);
  const [open, setOpen] = useState(false);
  const [papers, setPapers] = useState([]);
  const rootRef = useRef(null);
  const isStack = layout === "stack";

  const refresh = () => setPapers(loadSavedPapers());

  useEffect(() => {
    refresh();
    return subscribeSavedPapers(refresh);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const printPaper = (paper) => {
    const result = generatePdf(paper.meta, paper.questions);
    if (!result.ok) {
      toast.error(result.error || "Could not open this paper.");
      return;
    }
    toast.success("Print dialog opened — Save as PDF if you need a file.");
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", isStack && "w-full")}>
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          isStack && "w-full justify-between",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        My papers
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            "overflow-hidden rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 shadow-md",
            isStack
              ? "relative mt-2 w-full"
              : "absolute right-0 z-50 mt-2 w-[min(100vw-2rem,20rem)]",
          )}
        >
          <div className="border-b border-neutral-100 p-1.5">
            {selectedCount > 0 ? (
              <Link
                href={ROUTES.TEST_SUMMARY}
                role="menuitem"
                className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-small text-neutral-800 hover:bg-neutral-50"
                onClick={() => setOpen(false)}
              >
                <RotateCcw className="size-4 text-primary-700" aria-hidden="true" />
                Resume current paper
                <span className="ml-auto text-caption text-neutral-500">
                  {selectedCount}
                </span>
              </Link>
            ) : null}
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-left text-small text-neutral-800 hover:bg-neutral-50"
              onClick={() => {
                dispatch(clearSelection());
                setOpen(false);
                router.push(ROUTES.CLASSES);
              }}
            >
              <Plus className="size-4 text-primary-700" aria-hidden="true" />
              Start a new test
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto p-1.5">
            <p className="px-2.5 py-1.5 text-caption font-semibold tracking-wide text-neutral-500 uppercase">
              Previously generated
            </p>
            {papers.length === 0 ? (
              <p className="px-2.5 py-2 text-caption text-neutral-500">
                Papers you generate on this device will appear here.
              </p>
            ) : (
              <ul className="space-y-0.5">
                {papers.map((paper) => (
                  <li
                    key={paper.id}
                    className="flex items-start gap-1 rounded-[var(--radius-sm)] px-1 py-1 hover:bg-neutral-50"
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 rounded-[var(--radius-sm)] px-1.5 py-1 text-left"
                      onClick={() => printPaper(paper)}
                    >
                      <span className="flex items-start gap-2">
                        <FileText
                          className="mt-0.5 size-4 shrink-0 text-primary-700"
                          aria-hidden="true"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-small font-medium text-neutral-900">
                            {paperLabel(paper)}
                          </span>
                          <span className="block text-caption text-neutral-500">
                            {paperDateLabel(paper.createdAt)}
                            {paper.questionCount
                              ? ` · ${paper.questionCount} q`
                              : ""}
                          </span>
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-neutral-400 hover:bg-error-50 hover:text-error-700"
                      aria-label={`Delete ${paperLabel(paper)}`}
                      onClick={() => {
                        deleteSavedPaper(paper.id);
                        refresh();
                        toast.success("Paper removed from this device.");
                      }}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
