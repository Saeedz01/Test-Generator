/** Base path — all generator UI lives under this segment. */
export const GENERATOR_BASE = "/generator";

export function classPath(classId) {
  return `${GENERATOR_BASE}/${classId}`;
}

export function bookPath(classId, bookId) {
  return `${GENERATOR_BASE}/${classId}/${bookId}`;
}

export function chapterPath(classId, bookId, chapterId) {
  return `${GENERATOR_BASE}/${classId}/${bookId}/${chapterId}`;
}
