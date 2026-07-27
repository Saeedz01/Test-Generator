import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { schoolClass } from '../class/entities/class.entity';
import { CreateSchoolClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(schoolClass)
    private readonly schoolClassRepository: Repository<schoolClass>
  ) {}

  // -------service methods for admin------------

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
