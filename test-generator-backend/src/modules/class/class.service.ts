import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UpdateClassDto } from '../admin/dto/update-class.dto';
import { schoolClass } from './entities/class.entity';
import { CreateSchoolClassDto } from '../admin/dto/create-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSchoolClassDto): Promise<schoolClass> {
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

  async findAll(includeArchived = false) {
    const classes = await this.prisma.schoolClass.findMany({
      where: includeArchived ? undefined : { isArchived: false },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
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
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    return classData as unknown as schoolClass;
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    const existing = await this.prisma.schoolClass.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Class not found');
    }

    if (updateClassDto.name && updateClassDto.name !== existing.name) {
      const conflict = await this.prisma.schoolClass.findFirst({
        where: { name: updateClassDto.name, NOT: { id } },
      });
      if (conflict) {
        throw new ConflictException('Class name already exists');
      }
    }

    if (
      updateClassDto.code !== undefined &&
      updateClassDto.code !== existing.code
    ) {
      const codeConflict = await this.prisma.schoolClass.findFirst({
        where: { code: updateClassDto.code, NOT: { id } },
      });
      if (codeConflict) {
        throw new ConflictException('Class code already exists');
      }
    }

    const data: {
      name?: string;
      code?: string;
      description?: string | null;
      isArchived?: boolean;
      archivedAt?: Date | null;
    } = {};

    if (updateClassDto.name !== undefined) {
      data.name = updateClassDto.name;
    }
    if (updateClassDto.code !== undefined) {
      data.code = updateClassDto.code;
    }
    if (updateClassDto.description !== undefined) {
      data.description = updateClassDto.description;
    }
    if (updateClassDto.isArchived !== undefined) {
      data.isArchived = updateClassDto.isArchived;
      data.archivedAt = updateClassDto.isArchived ? new Date() : null;
    }

    return this.prisma.schoolClass.update({
      where: { id },
      data,
    });
  }

  async archive(id: string) {
    return this.update(id, { isArchived: true });
  }

  async unarchive(id: string) {
    return this.update(id, { isArchived: false });
  }

  async remove(id: string): Promise<void> {
    const result = await this.prisma.schoolClass.deleteMany({
      where: { id },
    });
    if (result.count === 0) {
      throw new NotFoundException('Class not found');
    }
    return;
  }
}
