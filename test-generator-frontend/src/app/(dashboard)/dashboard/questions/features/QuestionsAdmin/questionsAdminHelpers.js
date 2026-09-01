export function buildMcqOptions(options) {
  if (!Array.isArray(options)) return [];
  return options.map((option) => String(option ?? "").trim());
}

export function buildCreatePayload(form) {
  return {
    statement: form.statement.trim(),
    classId: form.classId,
    bookId: form.bookId,
    chapterId: form.chapterId,
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
