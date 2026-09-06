import { ConflictException, Injectable } from '@nestjs/common';
import { schoolClass } from '../class/entities/class.entity';
import { CreateSchoolClassDto } from './dto/create-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getDashboardStats() {
    const [classes, books, chapters, longQuestions, shortQuestions, mcqQuestions] =
      await Promise.all([
        this.prisma.schoolClass.count(),
        this.prisma.book.count(),
        this.prisma.chapter.count(),
        this.prisma.longQuestion.count(),
        this.prisma.shortQuestion.count(),
        this.prisma.mcqQuestion.count(),
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

    return await this.prisma.schoolClass.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        code:
          dto.code?.trim() ||
          dto.name.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 50),
        sortOrder: 0,
      },
    }) as unknown as schoolClass;
  }
}
