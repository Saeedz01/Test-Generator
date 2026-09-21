import {
  visibleBookWhere,
  visibleChapterWhere,
  visibleClassWhere,
  visibleQuestionWhere,
} from './visibility';

describe('public visibility filters', () => {
  it('hides archived classes', () => {
    expect(visibleClassWhere).toEqual({ isArchived: false });
  });

  it('hides deleted books and books of archived classes', () => {
    expect(visibleBookWhere).toEqual({
      deletedAt: null,
      class: { is: { isArchived: false } },
    });
  });

  it('chains chapters and questions to a visible book', () => {
    expect(visibleChapterWhere).toEqual({ book: { is: visibleBookWhere } });
    expect(visibleQuestionWhere).toEqual({
      chapter: { is: visibleChapterWhere },
    });
  });
});
