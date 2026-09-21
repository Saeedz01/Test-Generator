import { ConflictException, Injectable } from '@nestjs/common';
import { schoolClass } from '../class/entities/class.entity';
import { CreateSchoolClassDto } from './dto/create-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  visibleBookWhere,
  visibleChapterWhere,
  visibleClassWhere,
  visibleQuestionWhere,
} from 'src/common/visibility';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      classes,
      books,
      chapters,
      longQuestions,
      shortQuestions,
      mcqQuestions,
    ] = await Promise.all([
      // Archived classes and deleted books (with everything under them) are
      // not part of the live library, so they are not counted.
      this.prisma.schoolClass.count({ where: visibleClassWhere }),
      this.prisma.book.count({ where: visibleBookWhere }),
      this.prisma.chapter.count({ where: visibleChapterWhere }),
      this.prisma.longQuestion.count({ where: visibleQuestionWhere }),
      this.prisma.shortQuestion.count({ where: visibleQuestionWhere }),
      this.prisma.mcqQuestion.count({ where: visibleQuestionWhere }),
    ]);

    return {
      classes,
      books,
      chapters,
      questions: longQuestions + shortQuestions + mcqQuestions,
    };
  }

  async createClass(dto: CreateSchoolClassDto): Promise<schoolClass> {
    const existingClass = await this.prisma.schoolClass.findFirst({
      where: { name: dto.name },
    });
    if (existingClass) {
      throw new ConflictException('Class name already exists');
    }

    const code =
      dto.code?.trim() ||
      dto.name.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 50);
    const existingCode = await this.prisma.schoolClass.findFirst({
      where: { code },
    });
    if (existingCode) {
      throw new ConflictException('Class code already exists');
    }

    return (await this.prisma.schoolClass.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        code,
        sortOrder: 0,
      },
    })) as unknown as schoolClass;
  }
}
