"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  applyMarksConfig,
  DEFAULT_TEST_SETTINGS,
  loadInstitutes,
  loadTestSettings,
  rememberInstitute,
  saveTestSettings,
  storageErrorMessage,
} from "../utils/testSettingsStorage";
import { GenerateTestModalForm } from "./GenerateTestModalForm";

/**
 * Collects printable test settings before PDF generation.
 * The dialog body mounts on each open, so saved settings are re-read every time.
 */
export function GenerateTestModal({ open, ...props }) {
  if (!open) return null;
  return <GenerateTestModalDialog {...props} />;
}

function loadInitialSettings() {
  return { saved: loadTestSettings(), history: loadInstitutes() };
}

function GenerateTestModalDialog({
  onClose,
  questions,
  defaultClassName = "",
  onConfirm,
}) {
  const [{ saved, history }] = useState(loadInitialSettings);
  const [timeAllowed, setTimeAllowed] = useState(saved.timeAllowed);
  const [mcqMarks, setMcqMarks] = useState(saved.mcqMarks);
  const [shortMarks, setShortMarks] = useState(saved.shortMarks);
  const [longMarks, setLongMarks] = useState(saved.longMarks);
  const [instituteName, setInstituteName] = useState(
    saved.lastInstitute || history[0] || "",
  );
  const [institutes, setInstitutes] = useState(history);
  const [copiesPerPage, setCopiesPerPage] = useState(saved.copiesPerPage || 1);
  const [headingFontSize, setHeadingFontSize] = useState(saved.headingFontSize);
  const [subtextFontSize, setSubtextFontSize] = useState(saved.subtextFontSize);
  const [paperLanguage, setPaperLanguage] = useState(saved.paperLanguage || "en");
  const [showPaperHeader, setShowPaperHeader] = useState(
    saved.showPaperHeader !== false,
  );
  const [errors, setErrors] = useState({ institute: "", time: "" });

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { totalMarks, counts } = useMemo(
    () =>
      applyMarksConfig(questions, {
        mcqMarks,
        shortMarks,
        longMarks,
      }),
    [questions, mcqMarks, shortMarks, longMarks],
  );

  const submit = (event) => {
    event.preventDefault();
    const name = instituteName.trim();
    const time = timeAllowed.trim();
    const nextErrors = {
      institute:
        showPaperHeader && !name ? "Enter an institute name." : "",
      time: showPaperHeader && !time ? "Enter the time allowed." : "",
    };
    setErrors(nextErrors);
    if (nextErrors.institute || nextErrors.time) {
      return;
    }

    if (name) {
      const nextInstitutes = rememberInstitute(name);
      setInstitutes(nextInstitutes);
    }

    const settings = {
      timeAllowed: time || DEFAULT_TEST_SETTINGS.timeAllowed,
      mcqMarks: Number(mcqMarks) || 1,
      shortMarks: Number(shortMarks) || 1,
      longMarks: Number(longMarks) || 1,
      lastInstitute: name,
      copiesPerPage: Number(copiesPerPage) || 1,
      headingFontSize: Number(headingFontSize) || DEFAULT_TEST_SETTINGS.headingFontSize,
      subtextFontSize: Number(subtextFontSize) || DEFAULT_TEST_SETTINGS.subtextFontSize,
      paperLanguage: ["en", "ur", "both"].includes(paperLanguage)
        ? paperLanguage
        : "en",
      showPaperHeader,
    };
    // Saving settings is a convenience; if the browser refuses, say so
    // clearly and still generate the paper.
    const saved = saveTestSettings(settings);
    if (!saved.ok) {
      toast.error(storageErrorMessage(saved.reason), { duration: 8000 });
    }

    onConfirm?.({
      ...settings,
      totalMarks,
      counts,
      className: defaultClassName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
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
        className="relative z-10 max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-t-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-md sm:rounded-[var(--radius-card)] sm:p-6"
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
          paperLanguage={paperLanguage}
          setPaperLanguage={setPaperLanguage}
          showPaperHeader={showPaperHeader}
          setShowPaperHeader={setShowPaperHeader}
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
