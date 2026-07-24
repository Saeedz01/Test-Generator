"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/utils";
import {
  applyMarksConfig,
  loadInstitutes,
  loadTestSettings,
  rememberInstitute,
  saveTestSettings,
} from "../utils/testSettingsStorage";

const fieldClass =
  "mt-1.5 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 py-2 text-small text-neutral-900 outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30";

/**
 * Collects printable test settings before PDF generation.
 */
export function GenerateTestModal({
  open,
  onClose,
  questions,
  defaultClassName = "",
  onConfirm,
}) {
  const [timeAllowed, setTimeAllowed] = useState("1 hour 30 minutes");
  const [mcqMarks, setMcqMarks] = useState(1);
  const [shortMarks, setShortMarks] = useState(2);
  const [longMarks, setLongMarks] = useState(5);
  const [instituteName, setInstituteName] = useState("");
  const [institutes, setInstitutes] = useState([]);
  const [copiesPerPage, setCopiesPerPage] = useState(1);
  const [headingFontSize, setHeadingFontSize] = useState(18);
  const [subtextFontSize, setSubtextFontSize] = useState(12);

  useEffect(() => {
    if (!open) return;
    const saved = loadTestSettings();
    const history = loadInstitutes();
    setInstitutes(history);
    setTimeAllowed(saved.timeAllowed);
    setMcqMarks(saved.mcqMarks);
    setShortMarks(saved.shortMarks);
    setLongMarks(saved.longMarks);
    setInstituteName(saved.lastInstitute || history[0] || "");
    setCopiesPerPage(saved.copiesPerPage || 1);
    setHeadingFontSize(saved.headingFontSize);
    setSubtextFontSize(saved.subtextFontSize);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const { totalMarks, counts } = useMemo(
    () =>
      applyMarksConfig(questions, {
        mcqMarks,
        shortMarks,
        longMarks,
      }),
    [questions, mcqMarks, shortMarks, longMarks],
  );

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    const name = instituteName.trim();
    if (!name) {
      return;
    }
    if (!timeAllowed.trim()) {
      return;
    }

    const nextInstitutes = rememberInstitute(name);
    setInstitutes(nextInstitutes);

    const settings = {
      timeAllowed: timeAllowed.trim(),
      mcqMarks: Number(mcqMarks) || 1,
      shortMarks: Number(shortMarks) || 1,
      longMarks: Number(longMarks) || 1,
      lastInstitute: name,
      copiesPerPage: Number(copiesPerPage) || 1,
      headingFontSize: Number(headingFontSize) || 18,
      subtextFontSize: Number(subtextFontSize) || 12,
    };
    saveTestSettings(settings);

    onConfirm?.({
      ...settings,
      totalMarks,
      counts,
      className: defaultClassName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-neutral-900/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Test settings"
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 shadow-md sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-h5 font-semibold text-neutral-900">
              Test settings
            </h2>
            <p className="mt-1 text-small text-neutral-600">
              These values are saved locally and pre-filled next time.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-small font-medium text-neutral-500 transition-colors hover:text-neutral-800"
          >
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="text-caption font-medium text-neutral-600">
              Institute name
            </span>
            <input
              list="institute-history"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              placeholder="e.g. Crescent Public School"
              className={fieldClass}
              required
            />
            <datalist id="institute-history">
              {institutes.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            {institutes.length > 0 ? (
              <select
                className={cn(fieldClass, "mt-2")}
                value={institutes.includes(instituteName) ? instituteName : ""}
                onChange={(e) => {
                  if (e.target.value) setInstituteName(e.target.value);
                }}
                aria-label="Select saved institute"
              >
                <option value="">Select saved institute…</option>
                {institutes.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            ) : null}
          </label>

          <label className="block">
            <span className="text-caption font-medium text-neutral-600">
              Total time
            </span>
            <input
              type="text"
              value={timeAllowed}
              onChange={(e) => setTimeAllowed(e.target.value)}
              placeholder="e.g. 2 hours"
              className={fieldClass}
              required
            />
          </label>

          <label className="block">
            <span className="text-caption font-medium text-neutral-600">
              Tests per page
            </span>
            <select
              value={copiesPerPage}
              onChange={(e) => setCopiesPerPage(Number(e.target.value))}
              className={fieldClass}
            >
              <option value={1}>1 — full page</option>
              <option value={2}>2 — upper &amp; lower halves</option>
              <option value={4}>4 — 2×2 grid (left/right, upper/lower)</option>
            </select>
            <span className="mt-1 block text-caption text-neutral-500">
              {copiesPerPage === 1 && "One complete test printed on the page."}
              {copiesPerPage === 2 &&
                "Page split into top and bottom — same test in each half."}
              {copiesPerPage === 4 &&
                "Page split into four quadrants — same test in each section."}
            </span>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-caption font-medium text-neutral-600">
                Heading text size (px)
              </span>
              <input
                type="number"
                min="8"
                max="48"
                step="1"
                value={headingFontSize}
                onChange={(e) => setHeadingFontSize(e.target.value)}
                className={fieldClass}
                required
              />
              <span className="mt-1 block text-caption text-neutral-500">
                Institute title — default 18px
              </span>
            </label>
            <label className="block">
              <span className="text-caption font-medium text-neutral-600">
                Subtext size (px)
              </span>
              <input
                type="number"
                min="8"
                max="48"
                step="1"
                value={subtextFontSize}
                onChange={(e) => setSubtextFontSize(e.target.value)}
                className={fieldClass}
                required
              />
              <span className="mt-1 block text-caption text-neutral-500">
                Questions &amp; details — default 12px
              </span>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="text-caption font-medium text-neutral-600">
                Marks / MCQ
              </span>
              <input
                type="number"
                min="1"
                value={mcqMarks}
                onChange={(e) => setMcqMarks(e.target.value)}
                className={fieldClass}
                required
              />
              <span className="mt-1 block text-caption text-neutral-500">
                {counts.mcq} selected
              </span>
            </label>
            <label className="block">
              <span className="text-caption font-medium text-neutral-600">
                Marks / Short
              </span>
              <input
                type="number"
                min="1"
                value={shortMarks}
                onChange={(e) => setShortMarks(e.target.value)}
                className={fieldClass}
                required
              />
              <span className="mt-1 block text-caption text-neutral-500">
                {counts.short} selected
              </span>
            </label>
            <label className="block">
              <span className="text-caption font-medium text-neutral-600">
                Marks / Long
              </span>
              <input
                type="number"
                min="1"
                value={longMarks}
                onChange={(e) => setLongMarks(e.target.value)}
                className={fieldClass}
                required
              />
              <span className="mt-1 block text-caption text-neutral-500">
                {counts.long} selected
              </span>
            </label>
          </div>

          <div className="rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="text-small text-neutral-600">Calculated total marks</p>
            <p className="mt-1 text-h4 font-semibold text-primary-700">
              {totalMarks}
            </p>
            <p className="mt-1 text-caption text-neutral-500">
              ({counts.mcq} × {Number(mcqMarks) || 0}) + ({counts.short} ×{" "}
              {Number(shortMarks) || 0}) + ({counts.long} × {Number(longMarks) || 0})
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Generate PDF</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
