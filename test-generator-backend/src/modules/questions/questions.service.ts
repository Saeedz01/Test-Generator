import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CreatelngQuestionDto } from './dto/create-lng-question.dto';
import { CreateShortQuestionDto } from './dto/create-short-question.dto';
import { CreateMcqQuestionDto } from './dto/create-mcq-question.dto';
import { CreateQuestionBaseDto } from './dto/create-question-base.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { LongQuestion } from './entities/question.longQuestion';
import { ShortQuestion } from './entities/question.shortQuestion';
import { McqQuestion } from './entities/question.mcqs';
import { schoolClass } from '../class/entities/class.entity';
import { Book } from '../book/entities/book.entity';
import { Chapter } from '../chapter/entities/chapter.entity';

type QuestionEntity = LongQuestion | ShortQuestion | McqQuestion;

interface QuestionRelations {
  schoolClass: schoolClass;
  book: Book;
  chapter: Chapter;
}

@Injectable()
export class QuestionsService {

  constructor(
    @InjectRepository(LongQuestion)
    private readonly longQuestionRepository: Repository<LongQuestion>,

    @InjectRepository(ShortQuestion)
    private readonly shortQuestionRepository: Repository<ShortQuestion>,

    @InjectRepository(McqQuestion)
    private readonly mcqQuestionRepository: Repository<McqQuestion>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,

    @InjectRepository(schoolClass)
    private readonly classRepository: Repository<schoolClass>
  ) { }

  // common functions
  private async resolveQuestionRelations(classId: string, bookId: string, chapterId: string): Promise<QuestionRelations> {
    const [schoolClass, book, chapter] = await Promise.all([
      this.classRepository.findOne({ where: { id: classId } }),
      this.bookRepository.findOne({ where: { id: bookId }, relations: { class: true } }),
      this.chapterRepository.findOne({where: { id: chapterId },relations: { class: true, book: true } }),
    ]);

    if (!schoolClass) throw new NotFoundException('Class not found');
    if (!book) throw new NotFoundException('Book not found');
    if (!chapter) throw new NotFoundException('Chapter not found');

    if (book.class.id !== classId) {
      throw new BadRequestException('Book does not belong to the specified class');
    }

    if (chapter.class.id !== classId) {
      throw new BadRequestException('Chapter does not belong to the specified class');
    }

    if (chapter.book.id !== bookId) {
      throw new BadRequestException('Chapter does not belong to the specified book');
    }

    return { schoolClass, book, chapter };
  }

  private async assertUniqueStatement<T extends QuestionEntity>(
    repository: Repository<T>,
    statement: string,
  ): Promise<void> {
    const existing = await repository.findOne({
      where: { question_text: statement } as FindOptionsWhere<T>,
    });

    if (existing) {
      throw new ConflictException('Question already exists');
    }
  }

  private async createQuestion<T extends QuestionEntity>(
    repository: Repository<T>,
    { statement, classId, bookId, chapterId }: CreateQuestionBaseDto,
    extra?: DeepPartial<T>,
  ): Promise<T> {
    await this.assertUniqueStatement(repository, statement);

    const { schoolClass, book, chapter } = await this.resolveQuestionRelations(classId, bookId, chapterId);

    const question = repository.create({
      question_text: statement,
      class: schoolClass,
      book,
      chapter,
      ...extra,
    } as DeepPartial<T>);

    return repository.save(question);
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

  private async findAllFromRepository<T extends QuestionEntity>(
    repository: Repository<T>,
    type: 'long' | 'short' | 'mcq',
  ) {
    const questions = await repository.find({
      relations: ['class', 'book', 'chapter'],
    });

    if (questions.length === 0) {
      throw new NotFoundException('No questions found');
    }

    return questions.map((question) => this.mapQuestionResponse(question, type));
  }

  private async removeFromRepository<T extends QuestionEntity>(
    repository: Repository<T>,
    id: string,
  ): Promise<string> {
    const result = await repository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Question not found');
    }

    return `This action removes a #${id} question`;
  }

  // question creation functions
  async createLongQuestion(dto: CreatelngQuestionDto) {
    return this.createQuestion(this.longQuestionRepository, dto);
  }

  async createShortQuestion(dto: CreateShortQuestionDto) {
    return this.createQuestion(this.shortQuestionRepository, dto);
  }

  async createMcqQuestion(dto: CreateMcqQuestionDto) {
    const { options, ...baseDto } = dto;
    return this.createQuestion(this.mcqQuestionRepository, baseDto, { options });
  }

  // question retrieval functions
  async findAlllngQuestions() {
    return this.findAllFromRepository(this.longQuestionRepository, 'long');
  }

  async findAllmcqQuestions() {
    return this.findAllFromRepository(this.mcqQuestionRepository, 'mcq');
  }

  async findAllshortQuestions() {
    return this.findAllFromRepository(this.shortQuestionRepository, 'short');
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  // question deletion functions
  async removeLngQ(id: string) {
    return this.removeFromRepository(this.longQuestionRepository, id);
  }

  async removeShortQ(id: string) {
    return this.removeFromRepository(this.shortQuestionRepository, id);
  }

  async removeMcqQ(id: string) {
    return this.removeFromRepository(this.mcqQuestionRepository, id);
  }
}
