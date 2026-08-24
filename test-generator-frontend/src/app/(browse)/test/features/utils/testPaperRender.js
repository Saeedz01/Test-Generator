export const TYPE_ORDER = ["mcq", "short", "long"];
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

export function renderQuestion(question, index, compact) {
  const marks = Number(question.marks) || 0;
  let optionsHtml = "";

  if (question.type === "mcq" && Array.isArray(question.options)) {
    optionsHtml = `<div class="options-inline">${question.options
      .map(
        (option, optIndex) =>
          `<span class="option"><strong>${String.fromCharCode(65 + optIndex)})</strong> ${escapeHtml(option)}</span>`,
      )
      .join("")}</div>`;
  }

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
      <p class="q-text">${escapeHtml(question.statement)}</p>
      ${optionsHtml}
      ${answerSpace}
    </article>
  `;
}

export function renderTestBody(meta, questionsHtml, totalMarks, questionCount) {
  const institute = meta.instituteName || "Institute Name";

  return `
    <div class="sheet">
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
