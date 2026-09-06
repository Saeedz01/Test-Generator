import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { AdminOnly } from 'src/common/decorator/admin-only.decorator';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @AdminOnly()
  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto);
  }

  @Get()
  findAll(
    @Query('bookId') bookId?: string,
    @Query('classId') classId?: string,
  ) {
    return this.chapterService.findAll(bookId, classId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chapterService.findOne(id);
  }

  @AdminOnly()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chapterService.update(id, updateChapterDto);
  }

  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chapterService.remove(id);
  }
}
