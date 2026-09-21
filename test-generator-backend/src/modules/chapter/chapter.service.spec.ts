import { NotFoundException } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { visibleChapterWhere } from 'src/common/visibility';

describe('ChapterService', () => {
  const prisma = {
    chapter: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    book: { findFirst: jest.fn() },
  };

  let service: ChapterService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ChapterService(prisma as never);
  });

  it('keeps the visibility filter when scoping by book or class', async () => {
    prisma.chapter.findMany.mockResolvedValue([]);

    // Regression: spreading a `book` scope filter over visibleChapterWhere
    // replaced its `book` key, listing chapters of archived classes.
    await service.findAll(undefined, 'class-1');
    expect(prisma.chapter.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [visibleChapterWhere, { book: { classId: 'class-1' } }],
        },
      }),
    );

    await service.findAll('book-1');
    expect(prisma.chapter.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { AND: [visibleChapterWhere, { bookId: 'book-1' }] },
      }),
    );
  });

  it('hides a chapter whose book is deleted or class archived', async () => {
    prisma.chapter.findFirst.mockResolvedValue(null);

    await expect(service.findOne('ch1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.chapter.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ch1', ...visibleChapterWhere },
      }),
    );
  });

  it('refuses to create a chapter in a soft-deleted book', async () => {
    prisma.book.findFirst.mockResolvedValue(null);

    await expect(
      service.create({ bookId: 'b1', chapter_name: 'Motion', order: 1 }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.book.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'b1', deletedAt: null } }),
    );
  });

  it('never hard-deletes a chapter of a soft-deleted book', async () => {
    prisma.chapter.deleteMany.mockResolvedValue({ count: 0 });

    await expect(service.remove('ch1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.chapter.deleteMany).toHaveBeenCalledWith({
      where: { id: 'ch1', book: { is: { deletedAt: null } } },
    });
  });
});
