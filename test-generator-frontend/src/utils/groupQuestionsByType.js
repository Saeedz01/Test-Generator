/**
 * Group questions by type for board / admin lists.
 */
export function groupQuestionsByType(questions) {
  const groups = {
    mcq: [],
    short: [],
    long: [],
  };
  (questions ?? []).forEach((question) => {
    if (groups[question.type]) {
      groups[question.type].push(question);
    }
  });
  return groups;
}
