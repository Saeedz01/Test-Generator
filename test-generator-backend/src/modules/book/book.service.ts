import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { visibleBookWhere } from 'src/common/visibility';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * A book name may appear once per class (case-insensitive). The database
   * enforces the exact-case rule too (books_classId_book_name_key), which
   * also catches two concurrent creates.
   */
  private async assertBookNameAvailable(
    classId: string,
    bookName: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.book.findFirst({
      where: {
        classId,
        book_name: { equals: bookName, mode: 'insensitive' },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, deletedAt: true },
    });
    if (!existing) {
      return;
    }
    if (existing.deletedAt) {
      throw new ConflictException(ERROR_MESSAGES.BOOK_EXISTS_DELETED);
    }
    throw new ConflictException(ERROR_MESSAGES.BOOK_EXISTS_IN_CLASS);
  }

  // book service methods
  async createBook(createBookDto: CreateBookDto) {
    const schoolClassRecord = await this.prisma.schoolClass.findFirst({
      where: {
        name: createBookDto.class_name,
      },
    });

    if (!schoolClassRecord) {
      throw new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND);
    }

    await this.assertBookNameAvailable(
      schoolClassRecord.id,
      createBookDto.book_name,
    );

    return await this.prisma.book.create({
      data: {
        book_name: createBookDto.book_name,
        description: createBookDto.description,
        edition: createBookDto.edition,
        classId: schoolClassRecord.id,
      },
      include: { class: true },
    });
  }

  /** Public listing: excludes deleted books and books of archived classes. */
  async findAll(classId?: string) {
    const books = await this.prisma.book.findMany({
      where: { ...visibleBookWhere, ...(classId ? { classId } : {}) },
      include: {
        class: true,
        _count: {
          select: { chapters: true },
        },
      },
      orderBy: { book_name: 'asc' },
    });

    if (!books.length) {
      // return empty array instead of 404 so clients can handle empty lists gracefully
      return [];
    }

    // map to include convenient fields expected by frontend (classId and class_name)
    return books.map((book) => {
      const { _count, ...rest } = book;
      return {
        ...rest,
        classId: book.class?.id,
        class_name: book.class?.name,
        chaptersCount: Number(_count.chapters ?? 0),
      };
    });
  }

  /** Staff only: soft-deleted books, newest deletion first, for restoring. */
  async findDeleted() {
    const books = await this.prisma.book.findMany({
      where: { deletedAt: { not: null } },
      include: {
        class: true,
        _count: {
          select: { chapters: true },
        },
      },
      orderBy: { deletedAt: 'desc' },
    });

    return books.map((book) => {
      const { _count, ...rest } = book;
      return {
        ...rest,
        classId: book.class?.id,
        class_name: book.class?.name,
        chaptersCount: Number(_count.chapters ?? 0),
      };
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findFirst({
      where: { id, ...visibleBookWhere },
      include: { class: true },
    });

    if (!book) {
      throw new NotFoundException(ERROR_MESSAGES.BOOK_NOT_FOUND);
    }

    return {
      ...book,
      classId: book.class?.id,
      class_name: book.class?.name,
    };
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    // Deleted books must be restored before they can be edited.
    const book = await this.prisma.book.findFirst({
      where: { id, deletedAt: null },
      include: { class: true },
    });

    if (!book) {
      throw new NotFoundException(ERROR_MESSAGES.BOOK_NOT_FOUND);
    }

    const data: {
      book_name?: string;
      description?: string | null;
      edition?: string | null;
      classId?: string;
    } = {};

    if (updateBookDto.book_name !== undefined) {
      data.book_name = updateBookDto.book_name;
    }

    if (updateBookDto.description !== undefined) {
      data.description = updateBookDto.description;
    }

    if (updateBookDto.edition !== undefined) {
      data.edition = updateBookDto.edition;
    }

    if (updateBookDto.classId) {
      const schoolClassRecord = await this.prisma.schoolClass.findUnique({
        where: { id: updateBookDto.classId },
      });

      if (!schoolClassRecord) {
        throw new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND);
      }

      data.classId = schoolClassRecord.id;
    } else if (updateBookDto.class_name) {
      const schoolClassRecord = await this.prisma.schoolClass.findFirst({
        where: { name: updateBookDto.class_name },
      });

      if (!schoolClassRecord) {
        throw new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND);
      }

      data.classId = schoolClassRecord.id;
    }

    const nextClassId = data.classId ?? book.classId;
    const nextName = data.book_name ?? book.book_name;
    if (
      nextClassId &&
      (nextClassId !== book.classId ||
        nextName.toLowerCase() !== book.book_name.toLowerCase())
    ) {
      await this.assertBookNameAvailable(nextClassId, nextName, id);
    }

    return this.prisma.book.update({
      where: { id },
      data,
      include: { class: true },
    });
  }

  /**
   * Soft delete: the book (with its chapters and questions) is hidden from
   * every public listing but kept in the database so it can be restored.
   */
  async remove(id: string, actorId?: string): Promise<void> {
    const result = await this.prisma.book.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      throw new NotFoundException(ERROR_MESSAGES.BOOK_NOT_FOUND);
    }

    this.logger.log({
      event: 'book.soft_deleted',
      bookId: id,
      actorId: actorId ?? null,
    });
  }

  async restore(id: string, actorId?: string) {
    const book = await this.prisma.book.findFirst({
      where: { id, deletedAt: { not: null } },
      select: { id: true, classId: true, book_name: true },
    });
    if (!book) {
      throw new NotFoundException(ERROR_MESSAGES.BOOK_NOT_FOUND);
    }

    if (book.classId) {
      const conflict = await this.prisma.book.findFirst({
        where: {
          classId: book.classId,
          book_name: { equals: book.book_name, mode: 'insensitive' },
          deletedAt: null,
          NOT: { id },
        },
        select: { id: true },
      });
      if (conflict) {
        throw new ConflictException(ERROR_MESSAGES.BOOK_EXISTS_IN_CLASS);
      }
    }

    const restored = await this.prisma.book.update({
      where: { id },
      data: { deletedAt: null },
      include: { class: true },
    });

    this.logger.log({
      event: 'book.restored',
      bookId: id,
      actorId: actorId ?? null,
    });

    return {
      ...restored,
      classId: restored.class?.id,
      class_name: restored.class?.name,
    };
  }
}
