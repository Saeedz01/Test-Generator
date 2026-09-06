import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateSchoolClassDto } from '../admin/dto/create-class.dto';
import { UpdateClassDto } from '../admin/dto/update-class.dto';
import { AdminOnly } from 'src/common/decorator/admin-only.decorator';

@Controller('schoolclasses')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @AdminOnly()
  @Post()
  create(@Body() createClassDto: CreateSchoolClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get()
  findAll() {
    return this.classService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  @AdminOnly()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(id, updateClassDto);
  }

  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }
}
