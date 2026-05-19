/** @typedef {{ id: string, title: string }} ChapterDef */

/**
 * @param {string[]} titles
 * @returns {ChapterDef[]}
 */
export function chaptersFromTitles(titles) {
  return titles.map((t, i) => ({
    id: `ch-${i + 1}`,
    title: `Ch. ${i + 1}: ${t}`,
  }));
}
