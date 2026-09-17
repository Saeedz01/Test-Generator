import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
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
  findAll(@Query('includeArchived') includeArchived?: string) {
    return this.classService.findAll(includeArchived === 'true');
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
  @Post(':id/archive')
  archive(@Param('id') id: string) {
    return this.classService.archive(id);
  }

  @AdminOnly()
  @Post(':id/unarchive')
  unarchive(@Param('id') id: string) {
    return this.classService.unarchive(id);
  }

  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }
}
