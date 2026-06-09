import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatelngQuestionDto } from './dto/create-lng-question.dto';
import { CreateShortQuestionDto } from './dto/create-short-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { LongQuestion } from './entities/question.longQuestion';
import { schoolClass } from '../class/entities/class.entity';
import { Book } from '../book/entities/book.entity';
import { Chapter } from '../chapter/entities/chapter.entity';

@Injectable()
export class QuestionsService {

  constructor(
    @InjectRepository(LongQuestion)
    private readonly longQuestionRepository: Repository<LongQuestion>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,

    @InjectRepository(schoolClass)
    private readonly classRepository: Repository<schoolClass>
  ) { }


  async createLongQuestion(createlngQuestionDto: CreatelngQuestionDto) {
    const { statement, classId, bookId, chapterId } = createlngQuestionDto;

    const existingLongQuestion = await this.longQuestionRepository.findOne({
      where: { question_text: statement },
    });

    if (existingLongQuestion) {
      throw new ConflictException('Question already exists');
    }

    const [schoolClass, book, chapter] = await Promise.all([
      this.classRepository.findOne({ where: { id: classId } }),
      this.bookRepository.findOne({ where: { id: bookId } }),
      this.chapterRepository.findOne({ where: { id: chapterId } }),
    ]);

    if (!schoolClass) throw new NotFoundException('Class not found');
    if (!book) throw new NotFoundException('Book not found');
    if (!chapter) throw new NotFoundException('Chapter not found');

    const longQuestion = this.longQuestionRepository.create({
      question_text: statement,
      class: schoolClass,
      book: book,
      chapter: chapter,
    });

    return this.longQuestionRepository.save(longQuestion);
  }

  async createShortQuestion(createQuestionDto: CreateShortQuestionDto) {
    // TODO: Implement short question creation
  }

  async createMcqQuestion(createQuestionDto: CreateShortQuestionDto) {
    // TODO: Implement MCQ question creation
  }

  findAll() {
    return `This action returns all questions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
