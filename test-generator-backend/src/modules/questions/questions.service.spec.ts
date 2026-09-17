import { QuestionsService } from './questions.service';

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
    chapter: { findUnique: jest.fn() },
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
        where: { chapterId: 'ch1' },
        skip: 0,
        take: 10,
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
});
