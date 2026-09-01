import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { schoolClass } from '../class/entities/class.entity';
import { Book } from '../book/entities/book.entity';
import { Chapter } from '../chapter/entities/chapter.entity';
import { LongQuestion } from '../questions/entities/question.longQuestion';
import { ShortQuestion } from '../questions/entities/question.shortQuestion';
import { McqQuestion } from '../questions/entities/question.mcqs';
import { CreateSchoolClassDto } from './dto/create-class.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(schoolClass)
    private readonly schoolClassRepository: Repository<schoolClass>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,

    @InjectRepository(LongQuestion)
    private readonly longQuestionRepository: Repository<LongQuestion>,

    @InjectRepository(ShortQuestion)
    private readonly shortQuestionRepository: Repository<ShortQuestion>,

    @InjectRepository(McqQuestion)
    private readonly mcqQuestionRepository: Repository<McqQuestion>,
  ) {}

  async getDashboardStats() {
    const [classes, books, chapters, longQuestions, shortQuestions, mcqQuestions] =
      await Promise.all([
        this.schoolClassRepository.count(),
        this.bookRepository.count(),
        this.chapterRepository.count(),
        this.longQuestionRepository.count(),
        this.shortQuestionRepository.count(),
        this.mcqQuestionRepository.count(),
      ]);

    return {
      classes,
      books,
      chapters,
      questions: longQuestions + shortQuestions + mcqQuestions,
    };
  }

  async createClass(dto: CreateSchoolClassDto): Promise<schoolClass> {
    const existingClass = await this.schoolClassRepository.findOne({
      where: { name: dto.name },
    });
    if (existingClass) {
      throw new ConflictException('Class name already exists');
    }

    const newClass = this.schoolClassRepository.create({
      name: dto.name,
      description: dto.description,
      code: dto.code,
      sortOrder: 0,
    });
    return await this.schoolClassRepository.save(newClass);
  }
}
