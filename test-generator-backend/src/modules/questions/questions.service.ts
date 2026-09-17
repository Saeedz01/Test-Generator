import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatelngQuestionDto } from './dto/create-lng-question.dto';
import { CreateShortQuestionDto } from './dto/create-short-question.dto';
import { CreateMcqQuestionDto, McqOptionDto } from './dto/create-mcq-question.dto';
import { CreateQuestionBaseDto } from './dto/create-question-base.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateMcqQuestionDto } from './dto/update-mcq-question.dto';
import { LongQuestion } from './entities/question.longQuestion';
import { ShortQuestion } from './entities/question.shortQuestion';
import { McqQuestion } from './entities/question.mcqs';
import { Chapter } from '../chapter/entities/chapter.entity';
import { PrismaService } from 'src/prisma/prisma.service';

type QuestionEntity = LongQuestion | ShortQuestion | McqQuestion;
type QuestionKind = 'long' | 'short' | 'mcq';

type BilingualOption = { en: string; ur: string };

type QuestionWithNested = QuestionEntity & {
  questionTextUr?: string | null;
  options?: unknown;
  chapter?: {
    id: string;
    chapter_name: string;
    book?: {
      id: string;
      book_name: string;
      class?: { id: string; name: string } | null;
    } | null;
  } | null;
};

const questionInclude = {
  chapter: {
    include: {
      book: {
        include: {
          class: true,
        },
      },
    },
  },
} as const;

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  private questionDelegate(kind: QuestionKind): {
    findFirst: (args: unknown) => Promise<{ id: string } | null>;
    findMany: (args: unknown) => Promise<QuestionEntity[]>;
    findUnique: (args: unknown) => Promise<QuestionEntity | null>;
    deleteMany: (args: unknown) => Promise<{ count: number }>;
    update: (args: unknown) => Promise<QuestionEntity>;
    count: (args: unknown) => Promise<number>;
  } {
    if (kind === 'long') {
      return this.prisma.longQuestion as never;
    }
    if (kind === 'short') {
      return this.prisma.shortQuestion as never;
    }
    return this.prisma.mcqQuestion as never;
  }

  private normalizeMcqOptions(
    options: Array<McqOptionDto | string | { en?: string; ur?: string }>,
  ): BilingualOption[] {
    return options.map((option) => {
      if (typeof option === 'string') {
        return { en: option.trim(), ur: '' };
      }
      return {
        en: String(option.en ?? '').trim(),
        ur: String(option.ur ?? '').trim(),
      };
    });
  }

  private async resolveChapter(chapterId: string): Promise<Chapter> {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        book: { include: { class: true } },
      },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter as unknown as Chapter;
  }

  private async assertUniqueStatement(
    kind: QuestionKind,
    statement: string,
    chapterId: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.questionDelegate(kind).findFirst({
      where: { question_text: statement, chapterId },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        'Question already exists in this chapter',
      );
    }
  }

  private async createQuestion(
    kind: QuestionKind,
    {
      statement,
      statementUr,
      chapterId,
      marks,
      difficulty,
    }: CreateQuestionBaseDto,
    extra?: { options?: McqOptionDto[] },
  ) {
    await this.assertUniqueStatement(kind, statement.trim(), chapterId);

    const chapter = await this.resolveChapter(chapterId);

    const defaultMarks = kind === 'mcq' ? 1 : kind === 'short' ? 2 : 5;

    const data: Record<string, unknown> = {
      question_text: statement.trim(),
      questionTextUr: statementUr.trim(),
      chapterId: chapter.id,
      marks: marks ?? defaultMarks,
      difficulty: difficulty ?? 'medium',
    };

    if (extra?.options !== undefined) {
      data.options = this.normalizeMcqOptions(
        extra.options,
      ) as unknown as Prisma.InputJsonValue;
    }

    if (kind === 'mcq') {
      return this.prisma.mcqQuestion.create({
        data: data as Prisma.McqQuestionUncheckedCreateInput,
        include: questionInclude,
      });
    }

    if (kind === 'short') {
      return this.prisma.shortQuestion.create({
        data: data as Prisma.ShortQuestionUncheckedCreateInput,
        include: questionInclude,
      });
    }

    return this.prisma.longQuestion.create({
      data: data as Prisma.LongQuestionUncheckedCreateInput,
      include: questionInclude,
    });
  }

  private mapQuestionResponse(
    question: QuestionWithNested,
    type: 'long' | 'short' | 'mcq',
  ) {
    const book = question.chapter?.book;
    const schoolClass = book?.class;

    const response: Record<string, unknown> = {
      id: question.id,
      question_text: question.question_text,
      questionTextUr: question.questionTextUr ?? null,
      type,
      marks: (question as { marks?: number }).marks ?? null,
      difficulty: (question as { difficulty?: string }).difficulty ?? null,
      classId: schoolClass?.id ?? null,
      className: schoolClass?.name ?? null,
      bookId: book?.id ?? null,
      bookName: book?.book_name ?? null,
      chapterId: question.chapter?.id ?? null,
      chapterName: question.chapter?.chapter_name ?? null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };

    if (type === 'mcq' && 'options' in question) {
      response.options = this.normalizeMcqOptions(
        Array.isArray(question.options)
          ? (question.options as Array<string | BilingualOption>)
          : [],
      );
    }

    return response;
  }

  private buildQuestionWhere(query: {
    chapterId?: string;
    bookId?: string;
    classId?: string;
  }): Prisma.LongQuestionWhereInput {
    if (query.chapterId) {
      return { chapterId: query.chapterId };
    }
    if (query.bookId) {
      return { chapter: { bookId: query.bookId } };
    }
    if (query.classId) {
      return { chapter: { book: { classId: query.classId } } };
    }
    return {};
  }

  private async findAllFromRepository(
    kind: QuestionKind,
    type: 'long' | 'short' | 'mcq',
    query: {
      chapterId?: string;
      bookId?: string;
      classId?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(query.limit) || 100));
    const skip = (page - 1) * limit;
    const where = this.buildQuestionWhere(query);

    const [questions, total] = await Promise.all([
      this.questionDelegate(kind).findMany({
        where,
        include: questionInclude,
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.questionDelegate(kind).count({ where }),
    ]);

    return {
      data: questions.map((question) =>
        this.mapQuestionResponse(
          question as unknown as QuestionWithNested,
          type,
        ),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  private async removeFromRepository(
    kind: QuestionKind,
    id: string,
  ): Promise<{ message: string }> {
    const result = await this.questionDelegate(kind).deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      throw new NotFoundException('Question not found');
    }

    return { message: 'Question deleted' };
  }

  async createLongQuestion(dto: CreatelngQuestionDto) {
    return this.createQuestion('long', dto);
  }

  async createShortQuestion(dto: CreateShortQuestionDto) {
    return this.createQuestion('short', dto);
  }

  async createMcqQuestion(dto: CreateMcqQuestionDto) {
    const { options, ...baseDto } = dto;
    return this.createQuestion('mcq', baseDto, { options });
  }

  async findAlllngQuestions(query: {
    chapterId?: string;
    bookId?: string;
    classId?: string;
    page?: number;
    limit?: number;
  } = {}) {
    return this.findAllFromRepository('long', 'long', query);
  }

  async findAllmcqQuestions(query: {
    chapterId?: string;
    bookId?: string;
    classId?: string;
    page?: number;
    limit?: number;
  } = {}) {
    return this.findAllFromRepository('mcq', 'mcq', query);
  }

  async findAllshortQuestions(query: {
    chapterId?: string;
    bookId?: string;
    classId?: string;
    page?: number;
    limit?: number;
  } = {}) {
    return this.findAllFromRepository('short', 'short', query);
  }

  private async updateQuestion(
    kind: QuestionKind,
    id: string,
    dto: Partial<CreateQuestionBaseDto> & { options?: McqOptionDto[] },
    type: 'long' | 'short' | 'mcq',
  ) {
    const question = await this.questionDelegate(kind).findUnique({
      where: { id },
      include: questionInclude,
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const nested = question as QuestionWithNested;
    const chapterId = dto.chapterId ?? nested.chapter!.id;
    const statement = dto.statement ?? question.question_text;

    if (statement !== question.question_text) {
      await this.assertUniqueStatement(kind, statement, chapterId, id);
    }

    const chapter = await this.resolveChapter(chapterId);

    const data: {
      question_text: string;
      questionTextUr?: string | null;
      chapterId: string;
      marks?: number;
      difficulty?: string;
      options?: Prisma.InputJsonValue;
    } = {
      question_text: statement,
      chapterId: chapter.id,
    };

    if (dto.statementUr !== undefined) {
      data.questionTextUr = dto.statementUr.trim();
    }

    if (dto.marks !== undefined) {
      data.marks = dto.marks;
    }

    if (dto.difficulty !== undefined) {
      data.difficulty = dto.difficulty;
    }

    if (type === 'mcq' && dto.options) {
      data.options = this.normalizeMcqOptions(
        dto.options,
      ) as unknown as Prisma.InputJsonValue;
    }

    const savedQuestion = await this.questionDelegate(kind).update({
      where: { id },
      data,
      include: questionInclude,
    });
    return this.mapQuestionResponse(
      savedQuestion as unknown as QuestionWithNested,
      type,
    );
  }

  async updateLongQuestion(id: string, dto: UpdateQuestionDto) {
    return this.updateQuestion('long', id, dto, 'long');
  }

  async updateShortQuestion(id: string, dto: UpdateQuestionDto) {
    return this.updateQuestion('short', id, dto, 'short');
  }

  async updateMcqQuestion(id: string, dto: UpdateMcqQuestionDto) {
    const { options, ...baseDto } = dto;
    return this.updateQuestion('mcq', id, { ...baseDto, options }, 'mcq');
  }

  async removeLngQ(id: string) {
    return this.removeFromRepository('long', id);
  }

  async removeShortQ(id: string) {
    return this.removeFromRepository('short', id);
  }

  async removeMcqQ(id: string) {
    return this.removeFromRepository('mcq', id);
  }
}
