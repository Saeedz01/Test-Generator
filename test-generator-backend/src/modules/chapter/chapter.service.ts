import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Chapter } from './entities/chapter.entity';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type ChapterWithBookClass = Chapter & {
  book?: {
    id: string;
    book_name: string;
    class?: { id: string; name: string } | null;
  } | null;
};

@Injectable()
export class ChapterService {
  constructor(private prisma: PrismaService) {}

  async create(createChapterDto: CreateChapterDto) {
    const { bookId, chapter_name, order, description } = createChapterDto;

    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      include: { class: true },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const existingChapter = await this.prisma.chapter.findFirst({
      where: { chapter_name, bookId },
    });
    if (existingChapter) {
      throw new ConflictException('Chapter already exists');
    }

    const created = await this.prisma.chapter.create({
      data: {
        chapter_name,
        bookId: book.id,
        order,
        description: description ?? null,
      },
      include: {
        book: { include: { class: true } },
      },
    });

    return this.mapChapterResponse(created as unknown as ChapterWithBookClass);
  }

  async findAll(bookId?: string, classId?: string) {
    const chapters = await this.prisma.chapter.findMany({
      where: {
        ...(bookId ? { bookId } : {}),
        ...(classId ? { book: { classId } } : {}),
      },
      include: {
        book: { include: { class: true } },
      },
      orderBy: { order: 'asc' },
    });

    if (!chapters.length) {
      return [];
    }

    return chapters.map((ch) =>
      this.mapChapterResponse(ch as unknown as ChapterWithBookClass),
    );
  }

  async findOne(id: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
      include: {
        book: { include: { class: true } },
      },
    });
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    return chapter;
  }

  private mapChapterResponse(ch: ChapterWithBookClass) {
    return {
      id: ch.id,
      name: ch.chapter_name,
      classId: ch.book?.class?.id ?? null,
      className: ch.book?.class?.name ?? null,
      bookId: ch.book?.id ?? null,
      bookName: ch.book?.book_name ?? null,
      order: ch.order,
      description: ch.description,
      createdAt: ch.createdAt,
      updatedAt: ch.updatedAt,
    };
  }

  async update(id: string, updateChapterDto: UpdateChapterDto) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
      include: { book: { include: { class: true } } },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    const nextBookId = updateChapterDto.bookId ?? chapter.bookId;
    const nextChapterName =
      updateChapterDto.chapter_name ?? chapter.chapter_name;

    const duplicateChapter = await this.prisma.chapter.findFirst({
      where: {
        chapter_name: nextChapterName,
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
      bookId?: string;
    } = {};

    if (updateChapterDto.bookId) {
      const book = await this.prisma.book.findUnique({
        where: { id: nextBookId },
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
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
      include: { book: { include: { class: true } } },
    });
    return this.mapChapterResponse(
      savedChapter as unknown as ChapterWithBookClass,
    );
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
