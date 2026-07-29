import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateSchoolClassDto } from './dto/create-class.dto';
import { BookService } from '../book/book.service';
import { CreateBookDto } from '../book/dto/create-book.dto';
import { ChapterService } from '../chapter/chapter.service';
import { CreateChapterDto } from '../chapter/dto/create-chapter.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly bookService: BookService,
    private readonly chapterService: ChapterService
  ) {}

  @Post('createClass')
  createClass(@Body() dto: CreateSchoolClassDto) {
    return this.adminService.createClass(dto);
  }

  @Post('createBook')
  createBook(@Body() dto: CreateBookDto) {
    return this.bookService.createBook(dto);
  }

  @Post('createChapter')
  createChapter(@Body() dto: CreateChapterDto) {
    return this.chapterService.create(dto);
  }
  // @Get()
  // findAll() {
  //   return this.adminService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminService.remove(+id);
  // }
}
