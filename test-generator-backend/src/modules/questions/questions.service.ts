import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatelngQuestionDto } from './dto/create-lng-question.dto';
import { CreateShortQuestionDto } from './dto/create-short-question.dto';
import { CreateMcqQuestionDto } from './dto/create-mcq-question.dto';
import { CreateQuestionBaseDto } from './dto/create-question-base.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateMcqQuestionDto } from './dto/update-mcq-question.dto';
import { LongQuestion } from './entities/question.longQuestion';
import { ShortQuestion } from './entities/question.shortQuestion';
import { McqQuestion } from './entities/question.mcqs';
import { schoolClass } from '../class/entities/class.entity';
import { Book } from '../book/entities/book.entity';
import { Chapter } from '../chapter/entities/chapter.entity';
import { PrismaService } from 'src/prisma/prisma.service';

type QuestionEntity = LongQuestion | ShortQuestion | McqQuestion;
type QuestionKind = 'long' | 'short' | 'mcq';

interface QuestionRelations {
  schoolClass: schoolClass;
  book: Book;
  chapter: Chapter;
}

const questionInclude = {
  class: true,
  book: true,
  chapter: true,
} as const;

@Injectable()
export class QuestionsService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  private questionDelegate(kind: QuestionKind): {
    findFirst: (args: unknown) => Promise<{ id: string } | null>;
    findMany: (args: unknown) => Promise<QuestionEntity[]>;
    findUnique: (args: unknown) => Promise<QuestionEntity | null>;
    deleteMany: (args: unknown) => Promise<{ count: number }>;
    update: (args: unknown) => Promise<QuestionEntity>;
  } {
    if (kind === 'long') {
      return this.prisma.longQuestion as never;
    }
    if (kind === 'short') {
      return this.prisma.shortQuestion as never;
    }
    return this.prisma.mcqQuestion as never;
  }

  // common functions
  private async resolveQuestionRelations(classId: string, bookId: string, chapterId: string): Promise<QuestionRelations> {
    const [schoolClassRecord, book, chapter] = await Promise.all([
      this.prisma.schoolClass.findUnique({ where: { id: classId } }),
      this.prisma.book.findUnique({ where: { id: bookId }, include: { class: true } }),
      this.prisma.chapter.findUnique({where: { id: chapterId },include: { class: true, book: true } }),
    ]);

    if (!schoolClassRecord) throw new NotFoundException('Class not found');
    if (!book) throw new NotFoundException('Book not found');
    if (!chapter) throw new NotFoundException('Chapter not found');

    if (book.class!.id !== classId) {
      throw new BadRequestException('Book does not belong to the specified class');
    }

    if (chapter.class!.id !== classId) {
      throw new BadRequestException('Chapter does not belong to the specified class');
    }

    if (chapter.book!.id !== bookId) {
      throw new BadRequestException('Chapter does not belong to the specified book');
    }

    return { schoolClass: schoolClassRecord as unknown as schoolClass, book: book as unknown as Book, chapter: chapter as unknown as Chapter };
  }

  private async assertUniqueStatement(
    kind: QuestionKind,
    statement: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.questionDelegate(kind).findFirst({
      where: { question_text: statement },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Question already exists');
    }
  }

  private async createQuestion(
    kind: QuestionKind,
    { statement, classId, bookId, chapterId }: CreateQuestionBaseDto,
    extra?: { options?: string[] },
  ) {
    await this.assertUniqueStatement(kind, statement);

    const { schoolClass: schoolClassRecord, book, chapter } = await this.resolveQuestionRelations(classId, bookId, chapterId);

    const data = {
      question_text: statement,
      classId: schoolClassRecord.id,
      bookId: book.id,
      chapterId: chapter.id,
      ...(extra?.options !== undefined ? { options: extra.options as Prisma.InputJsonValue } : {}),
    };

    if (kind === 'mcq') {
      return this.prisma.mcqQuestion.create({
        data: data as Prisma.McqQuestionUncheckedCreateInput,
        include: questionInclude,
      });
    }

    if (kind === 'short') {
      return this.prisma.shortQuestion.create({
        data,
        include: questionInclude,
      });
    }

    return this.prisma.longQuestion.create({
      data,
      include: questionInclude,
    });
  }

  private mapQuestionResponse(question: QuestionEntity, type: 'long' | 'short' | 'mcq') {
    const response: Record<string, unknown> = {
      id: question.id,
      question_text: question.question_text,
      type,
      classId: question.class?.id ?? null,
      className: question.class?.name ?? null,
      bookId: question.book?.id ?? null,
      bookName: question.book?.book_name ?? null,
      chapterId: question.chapter?.id ?? null,
      chapterName: question.chapter?.chapter_name ?? null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };

    if (type === 'mcq' && 'options' in question) {
      response.options = question.options;
    }

    return response;
  }

  private async findAllFromRepository(
    kind: QuestionKind,
    type: 'long' | 'short' | 'mcq',
  ) {
    const questions = await this.questionDelegate(kind).findMany({
      include: questionInclude,
    });

    if (questions.length === 0) {
      throw new NotFoundException('No questions found');
    }

    return questions.map((question) => this.mapQuestionResponse(question as unknown as QuestionEntity, type));
  }

  private async removeFromRepository(
    kind: QuestionKind,
    id: string,
  ): Promise<string> {
    const result = await this.questionDelegate(kind).deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      throw new NotFoundException('Question not found');
    }

    return `This action removes a #${id} question`;
  }

  // question creation functions
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

  // question retrieval functions
  async findAlllngQuestions() {
    return this.findAllFromRepository('long', 'long');
  }

  async findAllmcqQuestions() {
    return this.findAllFromRepository('mcq', 'mcq');
  }

  async findAllshortQuestions() {
    return this.findAllFromRepository('short', 'short');
  }

  private async updateQuestion(
    kind: QuestionKind,
    id: string,
    dto: Partial<CreateQuestionBaseDto> & { options?: string[] },
    type: 'long' | 'short' | 'mcq',
  ) {
    const question = await this.questionDelegate(kind).findUnique({
      where: { id },
      include: questionInclude,
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const classId = dto.classId ?? question.class!.id;
    const bookId = dto.bookId ?? question.book!.id;
    const chapterId = dto.chapterId ?? question.chapter!.id;
    const statement = dto.statement ?? question.question_text;

    if (statement !== question.question_text) {
      await this.assertUniqueStatement(kind, statement, id);
    }

    const { schoolClass: schoolClassRecord, book, chapter } = await this.resolveQuestionRelations(
      classId,
      bookId,
      chapterId,
    );

    const data: {
      question_text: string;
      classId: string;
      bookId: string;
      chapterId: string;
      options?: Prisma.InputJsonValue;
    } = {
      question_text: statement,
      classId: schoolClassRecord.id,
      bookId: book.id,
      chapterId: chapter.id,
    };

    if (type === 'mcq' && dto.options) {
      data.options = dto.options as Prisma.InputJsonValue;
    }

    const savedQuestion = await this.questionDelegate(kind).update({
      where: { id },
      data,
      include: questionInclude,
    });
    return this.mapQuestionResponse(savedQuestion as unknown as QuestionEntity, type);
  }

  async updateLongQuestion(id: string, dto: UpdateQuestionDto) {
    return this.updateQuestion('long', id, dto, 'long');
  }

  async updateShortQuestion(id: string, dto: UpdateQuestionDto) {
    return this.updateQuestion('short', id, dto, 'short');
  }

  async updateMcqQuestion(id: string, dto: UpdateMcqQuestionDto) {
    const { options, ...baseDto } = dto;
    return this.updateQuestion(
      'mcq',
      id,
      { ...baseDto, options },
      'mcq',
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  // question deletion functions
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
