import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateClassDto } from '../admin/dto/update-class.dto';
import { schoolClass } from './entities/class.entity';
import { CreateSchoolClassDto } from '../admin/dto/create-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassService {

  constructor(
    private readonly prisma: PrismaService)
    {}
  
  async create(dto: CreateSchoolClassDto): Promise<schoolClass> {
    const existingClass = await this.prisma.schoolClass.findFirst({
      where: { name: dto.name },
    });

    if (existingClass) {
      throw new Error('Class name already exists');
    }

    return await this.prisma.schoolClass.create({
      data: {
        name: dto.name,
      } as Prisma.SchoolClassUncheckedCreateInput,
    }) as unknown as schoolClass;
  }

  async findAll() {
    const classes = await this.prisma.schoolClass.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: { books: true },
        },
      },
    });

    return classes.map((schoolClassRecord) => {
      const { _count, ...rest } = schoolClassRecord;
      return {
        ...rest,
        booksCount: Number(_count.books ?? 0),
      };
    });
  }

  async findOne(id: string): Promise<schoolClass> {
  const classData = await this.prisma.schoolClass.findUnique({
    where: { id },
    // relations: {
    //   books: true,
    //   chapters: true,
    //   questions: true,
    // },
  });

  if (!classData) {
    throw new NotFoundException('Class not found');
  }

    return classData as unknown as schoolClass;
}

  update(id: string, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  async remove(id: string): Promise<void> {
    const result = await this.prisma.schoolClass.deleteMany({
      where: { id },
    });
    if(result.count === 0) {
      throw new NotFoundException('Class not found');
    }
    return;
  }
}
