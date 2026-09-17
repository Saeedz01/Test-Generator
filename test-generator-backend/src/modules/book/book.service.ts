import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {

  constructor(
    
  // When the NestJS application starts, TypeORM registers the Book entity
  // and creates a repository for it, which acts as a ready-to-use interface for interacting with the books table.
  // When this service is instantiated, the NestJS dependency injection container checks this constructor
  // and sees that it requires a Book repository via @InjectRepository(Book).
  // The container then retrieves the pre-created Book repository and injects it into this variable(bookRepository),
  // making bookRepository capable of performing direct database operations like find, save, update, and delete.
    private readonly prisma: PrismaService,
  ) {}
  
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

  async findAll(classId?: string) {
    const books = await this.prisma.book.findMany({
      where: classId ? { classId } : undefined,
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

  async findOne(id: string) {
  const book = await this.prisma.book.findUnique({
    where: { id },
    include: { class: true },
    // relations: {
    //   chapters: true,
    //   questions: true,
    // },
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
    const book = await this.prisma.book.findUnique({
      where: { id },
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

    return this.prisma.book.update({
      where: { id },
      data,
      include: { class: true },
    });
  }

  async remove(id: string): Promise<void> {
  const result = await this.prisma.book.deleteMany({
    where: { id },
  });

  if (result.count === 0) {
    throw new NotFoundException(ERROR_MESSAGES.BOOK_NOT_FOUND);
  }
}

}
