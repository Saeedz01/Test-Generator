/**
 * Normalize questions to display/PDF ordering: mcq → short → long.
 *
 * @param {{ id: string, kind: 'mcq'|'short'|'long', text: string, options?: string[] }[]} list
 */
export function sortQuestionsForDisplay(list) {
  const rank = { mcq: 0, short: 1, long: 2 };
  return [...list].sort((a, b) => {
    const d = rank[a.kind] - rank[b.kind];
    return d !== 0 ? d : a.id.localeCompare(b.id);
  });
}

/** @param {{ id: string, kind: 'mcq'|'short'|'long', text: string, options?: string[] }[]} list */
export function groupQuestionsByKind(list) {
  const sorted = sortQuestionsForDisplay(list);
  return {
    mcq: sorted.filter((q) => q.kind === "mcq"),
    short: sorted.filter((q) => q.kind === "short"),
    long: sorted.filter((q) => q.kind === "long"),
  };
}
