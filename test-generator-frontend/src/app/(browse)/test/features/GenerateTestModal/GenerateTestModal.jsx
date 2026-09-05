"use client";

import { useEffect, useMemo, useState } from "react";
import {
  applyMarksConfig,
  loadInstitutes,
  loadTestSettings,
  rememberInstitute,
  saveTestSettings,
} from "../utils/testSettingsStorage";
import { GenerateTestModalForm } from "./GenerateTestModalForm";

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
  const [errors, setErrors] = useState({ institute: "", time: "" });

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
    setErrors({ institute: "", time: "" });
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
    const nextErrors = {
      institute: name ? "" : "Enter an institute name.",
      time: timeAllowed.trim() ? "" : "Enter the time allowed.",
    };
    setErrors(nextErrors);
    if (nextErrors.institute || nextErrors.time) {
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

        <GenerateTestModalForm
          instituteName={instituteName}
          setInstituteName={setInstituteName}
          institutes={institutes}
          timeAllowed={timeAllowed}
          setTimeAllowed={setTimeAllowed}
          copiesPerPage={copiesPerPage}
          setCopiesPerPage={setCopiesPerPage}
          headingFontSize={headingFontSize}
          setHeadingFontSize={setHeadingFontSize}
          subtextFontSize={subtextFontSize}
          setSubtextFontSize={setSubtextFontSize}
          mcqMarks={mcqMarks}
          setMcqMarks={setMcqMarks}
          shortMarks={shortMarks}
          setShortMarks={setShortMarks}
          longMarks={longMarks}
          setLongMarks={setLongMarks}
          counts={counts}
          totalMarks={totalMarks}
          errors={errors}
          onClose={onClose}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}
