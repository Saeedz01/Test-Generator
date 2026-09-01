export function buildMcqOptions(options) {
  if (!Array.isArray(options)) return [];
  return options.map((option) => String(option ?? "").trim());
}

export function buildMcqOptionsForForm(options) {
  const normalized = buildMcqOptions(options);
  while (normalized.length < 4) {
    normalized.push("");
  }
  return normalized.slice(0, 4);
}

export function buildCreatePayload(form) {
  return {
    statement: form.statement.trim(),
    classId: form.classId,
    bookId: form.bookId,
    chapterId: form.chapterId,
  };
}

export function buildQuestionFormFromItem(item) {
  return {
    statement: item.statement || "",
    type: item.type || "mcq",
    classId: item.classId || "",
    bookId: item.bookId || "",
    chapterId: item.chapterId || "",
    options:
      item.type === "mcq"
        ? buildMcqOptionsForForm(item.options)
        : buildMcqOptionsForForm([]),
  };
}

export function normalizeChapter(item) {
  return {
    ...item,
    name: item.name ?? item.chapter_name ?? "",
    classId: item.classId ?? item.class?.id ?? "",
    bookId: item.bookId ?? item.book?.id ?? "",
    order: item.order ?? 0,
  };
}
