import { QuestionsService } from './questions.service';
import { visibleQuestionWhere } from 'src/common/visibility';

describe('QuestionsService list filters', () => {
  const longQuestion = {
    findMany: jest.fn(),
    count: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    deleteMany: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };

  const prisma = {
    longQuestion,
    shortQuestion: longQuestion,
    mcqQuestion: longQuestion,
    chapter: { findFirst: jest.fn() },
  };

  let service: QuestionsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new QuestionsService(prisma as never);
  });

  it('lists long questions scoped by chapter with pagination meta', async () => {
    longQuestion.findMany.mockResolvedValue([
      {
        id: 'q1',
        question_text: 'What is force?',
        questionTextUr: 'قوت کیا ہے؟',
        marks: 5,
        difficulty: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
        chapter: {
          id: 'ch1',
          chapter_name: 'Motion',
          book: {
            id: 'b1',
            book_name: 'Physics',
            class: { id: 'c1', name: '9th' },
          },
        },
      },
    ]);
    longQuestion.count.mockResolvedValue(1);

    const result = await service.findAlllngQuestions({
      chapterId: 'ch1',
      page: 1,
      limit: 10,
    });

    expect(longQuestion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { AND: [visibleQuestionWhere, { chapterId: 'ch1' }] },
        skip: 0,
        take: 10,
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      }),
    );
    expect(result.data).toHaveLength(1);
    expect(result.meta).toMatchObject({ total: 1, page: 1, limit: 10 });
    expect(result.data[0]).toMatchObject({
      marks: 5,
      difficulty: 'medium',
      chapterId: 'ch1',
    });
  });

  it('rejects moving a question into a chapter that already has the same text', async () => {
    longQuestion.findFirst
      .mockResolvedValueOnce({
        id: 'q1',
        question_text: 'What is force?',
        chapter: { id: 'ch1', chapter_name: 'Motion', book: null },
      })
      .mockResolvedValueOnce({ id: 'q2' });

    await expect(
      service.updateLongQuestion('q1', {
        chapterId: '00000000-0000-4000-8000-000000000002',
      }),
    ).rejects.toMatchObject({ status: 409 });
    expect(longQuestion.findFirst).toHaveBeenLastCalledWith({
      where: {
        question_text: 'What is force?',
        chapterId: '00000000-0000-4000-8000-000000000002',
      },
    });
    expect(longQuestion.update).not.toHaveBeenCalled();
  });

  it('trims the statement on update', async () => {
    longQuestion.findFirst
      .mockResolvedValueOnce({
        id: 'q1',
        question_text: 'Old',
        chapter: { id: 'ch1', chapter_name: 'Motion', book: null },
      })
      .mockResolvedValueOnce(null);
    prisma.chapter.findFirst.mockResolvedValue({ id: 'ch1' });
    longQuestion.update.mockResolvedValue({
      id: 'q1',
      question_text: 'New',
      chapter: { id: 'ch1', chapter_name: 'Motion', book: null },
    });

    await service.updateLongQuestion('q1', { statement: '  New  ' });
    expect(longQuestion.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ question_text: 'New' }),
      }),
    );
  });

  it('does not edit questions whose book was soft-deleted', async () => {
    longQuestion.findFirst.mockResolvedValueOnce(null);

    await expect(
      service.updateLongQuestion('q1', { statement: 'New' }),
    ).rejects.toMatchObject({ status: 404 });
    expect(longQuestion.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'q1',
          chapter: { is: { book: { is: { deletedAt: null } } } },
        },
      }),
    );
  });
});
