import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateSchoolClassDto } from '../admin/dto/create-class.dto';
import { UpdateClassDto } from '../admin/dto/update-class.dto';
import {
  AdminOnly,
  SuperAdminOnly,
} from 'src/common/decorator/admin-only.decorator';
import { StaffViewGuard } from 'src/common/guards/staff-view.guard';

@Controller('schoolclasses')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @AdminOnly()
  @Post()
  create(@Body() createClassDto: CreateSchoolClassDto) {
    return this.classService.create(createClassDto);
  }

  // Archived classes are listed only for authenticated staff.
  @UseGuards(StaffViewGuard)
  @Get()
  findAll(@Query('includeArchived') includeArchived?: string) {
    return this.classService.findAll(includeArchived === 'true');
  }

  @UseGuards(StaffViewGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeArchived') includeArchived?: string,
  ) {
    return this.classService.findOne(id, includeArchived === 'true');
  }

  @AdminOnly()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classService.update(id, updateClassDto);
  }

  @AdminOnly()
  @Post(':id/archive')
  archive(@Param('id', ParseUUIDPipe) id: string) {
    return this.classService.archive(id);
  }

  @AdminOnly()
  @Post(':id/unarchive')
  unarchive(@Param('id', ParseUUIDPipe) id: string) {
    return this.classService.unarchive(id);
  }

  // Deleting a class cascades to all of its books, chapters and questions,
  // so it is restricted to super admins (admins can archive instead).
  @SuperAdminOnly()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.classService.remove(id);
  }
}
