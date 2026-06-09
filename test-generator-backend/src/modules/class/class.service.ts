import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateClassDto } from './dto/update-class.dto';
import { schoolClass } from './entities/class.entity';
import { CreateSchoolClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassService {

  constructor(
    @InjectRepository(schoolClass)
    private readonly schoolClassRepository: Repository<schoolClass>)
    {}
  
  async create(dto: CreateSchoolClassDto): Promise<schoolClass> {
    const existingClass = await this.schoolClassRepository.findOne({
      where: { name: dto.name },
    });

    if (existingClass) {
      throw new Error('Class name already exists');
    }

    const newClass = this.schoolClassRepository.create({
      name: dto.name,
    });

    return await this.schoolClassRepository.save(newClass);
  }

  async findAll() {
    const classes = await this.schoolClassRepository.find({
    //   order: {
    //   sortOrder: 'ASC',
    // },
    // relations: {
    //   books: true,
    //   chapters: true,
    //   questions: true,
    // },
    })
    if(!classes || classes.length === 0) {
      throw new NotFoundException('No classes found');
    }
    return classes;
  }

  async findOne(id: string): Promise<schoolClass> {
  const classData = await this.schoolClassRepository.findOne({
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

  return classData;
}

  update(id: string, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  async remove(id: string): Promise<void> {
    const result = await this.schoolClassRepository.delete(id)
    if(result.affected === 0) {
      throw new NotFoundException('Class not found');
    }
    return;
  }
}
