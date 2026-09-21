import { ConflictException, NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { visibleBookWhere } from 'src/common/visibility';

describe('BookService', () => {
  const prisma = {
    schoolClass: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    book: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  let service: BookService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BookService(prisma as never);
  });

  const dto = {
    book_name: 'Chemistry',
    class_name: 'Class 9',
    description: '',
    edition: '',
  };

  describe('create (one book name per class)', () => {
    it('creates a book when the class has no book with that name', async () => {
      prisma.schoolClass.findFirst.mockResolvedValue({ id: 'c9' });
      prisma.book.findFirst.mockResolvedValue(null);
      prisma.book.create.mockResolvedValue({ id: 'b1' });

      await service.createBook(dto);

      expect(prisma.book.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            classId: 'c9',
            book_name: { equals: 'Chemistry', mode: 'insensitive' },
          },
        }),
      );
      expect(prisma.book.create).toHaveBeenCalled();
    });

    it('rejects a duplicate name in the same class (case-insensitive)', async () => {
      prisma.schoolClass.findFirst.mockResolvedValue({ id: 'c9' });
      prisma.book.findFirst.mockResolvedValue({ id: 'b1', deletedAt: null });

      await expect(
        service.createBook({ ...dto, book_name: 'chemistry' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.book.create).not.toHaveBeenCalled();
    });

    it('points to restore when the duplicate is a deleted book', async () => {
      prisma.schoolClass.findFirst.mockResolvedValue({ id: 'c9' });
      prisma.book.findFirst.mockResolvedValue({
        id: 'b1',
        deletedAt: new Date(),
      });

      await expect(service.createBook(dto)).rejects.toThrow(/Restore it/);
    });

    it('checks uniqueness only within the target class', async () => {
      prisma.schoolClass.findFirst.mockResolvedValue({ id: 'c10' });
      prisma.book.findFirst.mockResolvedValue(null);
      prisma.book.create.mockResolvedValue({ id: 'b2' });

      await service.createBook({ ...dto, class_name: 'Class 10' });

      expect(prisma.book.findFirst.mock.calls[0][0].where.classId).toBe('c10');
    });
  });

  describe('update', () => {
    it('re-checks uniqueness when a book moves to another class', async () => {
      prisma.book.findFirst
        .mockResolvedValueOnce({
          id: 'b1',
          classId: 'c9',
          book_name: 'Chemistry',
        })
        .mockResolvedValueOnce({ id: 'b9', deletedAt: null });
      prisma.schoolClass.findUnique.mockResolvedValue({ id: 'c10' });

      await expect(
        service.update('b1', {
          classId: '00000000-0000-4000-8000-000000000010',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.book.update).not.toHaveBeenCalled();
    });

    it('refuses to edit a soft-deleted book', async () => {
      prisma.book.findFirst.mockResolvedValue(null);

      await expect(
        service.update('b1', { book_name: 'X' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.book.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'b1', deletedAt: null } }),
      );
    });
  });

  describe('soft delete', () => {
    it('marks the book deleted instead of removing rows', async () => {
      prisma.book.updateMany.mockResolvedValue({ count: 1 });

      await service.remove('b1', 'admin-1');

      expect(prisma.book.updateMany).toHaveBeenCalledWith({
        where: { id: 'b1', deletedAt: null },
        data: { deletedAt: expect.any(Date) },
      });
      expect(prisma.book.deleteMany).not.toHaveBeenCalled();
    });

    it('404s for unknown or already deleted books', async () => {
      prisma.book.updateMany.mockResolvedValue({ count: 0 });
      await expect(service.remove('b1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('restores a deleted book', async () => {
      prisma.book.findFirst
        .mockResolvedValueOnce({
          id: 'b1',
          classId: 'c9',
          book_name: 'Chemistry',
        })
        .mockResolvedValueOnce(null);
      prisma.book.update.mockResolvedValue({
        id: 'b1',
        class: { id: 'c9', name: 'Class 9' },
      });

      await expect(service.restore('b1')).resolves.toMatchObject({
        classId: 'c9',
      });
      expect(prisma.book.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { deletedAt: null } }),
      );
    });
  });

  describe('public reads', () => {
    it('lists only visible books (not deleted, class not archived)', async () => {
      prisma.book.findMany.mockResolvedValue([]);

      await service.findAll('c9');

      expect(prisma.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { ...visibleBookWhere, classId: 'c9' },
        }),
      );
    });

    it('hides a deleted book on direct lookup', async () => {
      prisma.book.findFirst.mockResolvedValue(null);

      await expect(service.findOne('b1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.book.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'b1', ...visibleBookWhere } }),
      );
    });
  });
});
