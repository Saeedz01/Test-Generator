import {
  resolveOptionText,
  resolveStatement,
  sectionTitle,
} from "./paperLanguage";

export const TYPE_ORDER = ["mcq", "short", "long"];
/** @deprecated use sectionTitle(type, language) */
export const TYPE_TITLE = {
  mcq: "Section A — Multiple Choice Questions",
  short: "Section B — Short Questions",
  long: "Section C — Long Questions",
};

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function sortQuestions(questions) {
  return [...questions].sort((a, b) => {
    const typeDiff = TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
    if (typeDiff !== 0) return typeDiff;
    return String(a.id).localeCompare(String(b.id));
  });
}

function renderBilingualText(resolved, language) {
  if (language === "both" && resolved && typeof resolved === "object") {
    const en = escapeHtml(resolved.en);
    const ur = escapeHtml(resolved.ur);
    return `
      <div class="q-text-bilingual">
        ${en ? `<p class="q-text q-text-en" lang="en" dir="ltr">${en}</p>` : ""}
        ${ur ? `<p class="q-text q-text-ur" lang="ur" dir="rtl">${ur}</p>` : ""}
      </div>
    `;
  }
  const text = escapeHtml(resolved);
  const isUr = language === "ur";
  return `<p class="q-text${isUr ? " q-text-ur" : ""}" lang="${isUr ? "ur" : "en"}" dir="${isUr ? "rtl" : "ltr"}">${text}</p>`;
}

function renderOptions(question, language, compact) {
  if (question.type !== "mcq" || !Array.isArray(question.options)) {
    return "";
  }

  const optionsHtml = question.options
    .map((option, optIndex) => {
      const label = String.fromCharCode(65 + optIndex);
      const resolved = resolveOptionText(option, language);

      if (language === "both" && resolved && typeof resolved === "object") {
        return `<span class="option option-both">
          <strong>${label})</strong>
          <span class="opt-en" lang="en" dir="ltr">${escapeHtml(resolved.en)}</span>
          ${resolved.ur ? `<span class="opt-ur" lang="ur" dir="rtl">${escapeHtml(resolved.ur)}</span>` : ""}
        </span>`;
      }

      const isUr = language === "ur";
      return `<span class="option"${isUr ? ' lang="ur" dir="rtl"' : ""}><strong>${label})</strong> ${escapeHtml(resolved)}</span>`;
    })
    .join("");

  return `<div class="options-inline${compact ? " compact" : ""}">${optionsHtml}</div>`;
}

export function renderQuestion(question, index, compact, language = "en") {
  const marks = Number(question.marks) || 0;
  const statement = resolveStatement(question, language);
  const optionsHtml = renderOptions(question, language, compact);

  const answerSpace =
    question.type === "short"
      ? `<div class="answer-space answer-space-short${compact ? " compact" : ""}"></div>`
      : question.type === "long"
        ? `<div class="answer-space answer-space-long${compact ? " compact" : ""}"></div>`
        : "";

  return `
    <article class="question">
      <header>
        <span class="q-no">Q${index}.</span>
        <span class="q-marks">[${marks}]</span>
      </header>
      ${renderBilingualText(statement, language)}
      ${optionsHtml}
      ${answerSpace}
    </article>
  `;
}

export function renderSectionHeading(type, language = "en") {
  const title = sectionTitle(type, language);
  if (language === "both" && title && typeof title === "object") {
    return `<h2 class="section-title">
      <span lang="en" dir="ltr">${escapeHtml(title.en)}</span>
      <span class="section-title-ur" lang="ur" dir="rtl">${escapeHtml(title.ur)}</span>
    </h2>`;
  }
  const isUr = language === "ur";
  return `<h2 class="section-title"${isUr ? ' lang="ur" dir="rtl"' : ""}>${escapeHtml(title)}</h2>`;
}

export function renderTestBody(meta, questionsHtml, totalMarks, questionCount) {
  const institute = meta.instituteName || "Institute Name";
  const language = meta.paperLanguage || "en";
  const sheetDir = language === "ur" ? "rtl" : "ltr";
  const sheetLang = language === "ur" ? "ur" : "en";

  return `
    <div class="sheet" lang="${sheetLang}" dir="${sheetDir}" data-language="${language}">
      <h1 class="institute">${escapeHtml(institute)}</h1>
      <p class="meta">
        ${escapeHtml(meta.className || "—")}
        ${meta.bookName ? ` · ${escapeHtml(meta.bookName)}` : ""}
        ${meta.chapterName ? ` · ${escapeHtml(meta.chapterName)}` : ""}
      </p>

      <div class="student-row">
        <span class="field">Name<span class="line"></span></span>
        <span class="field">Section<span class="line"></span></span>
        <span class="field">Class<span class="line"></span></span>
      </div>

      <div class="summary">
        <span>Questions: ${questionCount}</span>
        <span>Total Marks: ${totalMarks}</span>
        <span>Time Allowed: ${escapeHtml(meta.timeAllowed || "________")}</span>
      </div>
      ${questionsHtml}
    </div>
  `;
}
