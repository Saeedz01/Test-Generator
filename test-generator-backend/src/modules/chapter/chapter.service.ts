import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Chapter } from './entities/chapter.entity';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChapterService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createChapterDto: CreateChapterDto) {
    const { classId, bookId, chapter_name, order, description } = createChapterDto;
    //check if chapter already exists
    const existingChapter = await this.prisma.chapter.findFirst({
      where: { chapter_name, classId, bookId },
    });
    if (existingChapter) {
      throw new ConflictException('Chapter already exists');
    }

    const schoolClass = await this.prisma.schoolClass.findUnique({
      where: { id: classId },
    });
    if (!schoolClass) {
      throw new NotFoundException('Class not found');
    }

    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      include: { class: true },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.class!.id !== classId) {
      throw new BadRequestException('Book does not belong to the specified class');
    }

    //create chapter
    return await this.prisma.chapter.create({
      data: {
        chapter_name,
        classId: schoolClass.id,
        bookId: book.id,
        order,
        description: description ?? null,
      },
      include: {
        class: true,
        book: true,
      },
    });
  }

  async findAll(bookId?: string, classId?: string) {
    const chapters = await this.prisma.chapter.findMany({
      where: {
        ...(bookId ? { bookId } : {}),
        ...(classId ? { classId } : {}),
      },
      include: {
        class: true,
        book: true,
      },
      orderBy: { order: 'asc' },
    });

    if (!chapters.length) {
      return [];
    }

    // Normalize shape for frontend: provide `id`, `name`, `classId`, `bookId`, `order`, `description`
    return chapters.map((ch) => this.mapChapterResponse(ch as unknown as Chapter));
  }

  async findOne(id: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id:id },
    });
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    return chapter;
  }

  private mapChapterResponse(ch: Chapter) {
    return {
      id: ch.id,
      name: ch.chapter_name,
      classId: ch.class?.id,
      className: ch.class?.name,
      bookId: ch.book?.id,
      bookName: ch.book?.book_name,
      order: ch.order,
      description: ch.description,
      createdAt: ch.createdAt,
      updatedAt: ch.updatedAt,
    };
  }

  async update(id: string, updateChapterDto: UpdateChapterDto) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
      include: { class: true, book: true },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    const nextClassId = updateChapterDto.classId ?? chapter.class!.id;
    const nextBookId = updateChapterDto.bookId ?? chapter.book!.id;
    const nextChapterName = updateChapterDto.chapter_name ?? chapter.chapter_name;

    const duplicateChapter = await this.prisma.chapter.findFirst({
      where: {
        chapter_name: nextChapterName,
        classId: nextClassId,
        bookId: nextBookId,
      },
    });

    if (duplicateChapter && duplicateChapter.id !== id) {
      throw new ConflictException('Chapter already exists');
    }

    const data: {
      chapter_name?: string;
      order?: number;
      description?: string | null;
      classId?: string;
      bookId?: string;
    } = {};

    if (updateChapterDto.classId || updateChapterDto.bookId) {
      const schoolClass = await this.prisma.schoolClass.findUnique({
        where: { id: nextClassId },
      });
      if (!schoolClass) {
        throw new NotFoundException('Class not found');
      }

      const book = await this.prisma.book.findUnique({
        where: { id: nextBookId },
        include: { class: true },
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }

      if (book.class!.id !== nextClassId) {
        throw new BadRequestException('Book does not belong to the specified class');
      }

      data.classId = schoolClass.id;
      data.bookId = book.id;
    }

    if (updateChapterDto.chapter_name !== undefined) {
      data.chapter_name = updateChapterDto.chapter_name;
    }

    if (updateChapterDto.order !== undefined) {
      data.order = updateChapterDto.order;
    }

    if (updateChapterDto.description !== undefined) {
      data.description = updateChapterDto.description;
    }

    const savedChapter = await this.prisma.chapter.update({
      where: { id },
      data,
      include: { class: true, book: true },
    });
    return this.mapChapterResponse(savedChapter as unknown as Chapter);
  }

  async remove(id: string) {
    const chapter = await this.prisma.chapter.deleteMany({
      where: { id },
    });
    if (chapter.count === 0) {
      throw new NotFoundException('Chapter not found');
    }
    return { raw: [], affected: chapter.count };
  }
}
