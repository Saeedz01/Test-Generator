import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateSchoolClassDto } from './dto/create-class.dto';
import { BookService } from '../book/book.service';
import { CreateBookDto } from '../book/dto/create-book.dto';
import { ChapterService } from '../chapter/chapter.service';
import { CreateChapterDto } from '../chapter/dto/create-chapter.dto';
import { QuestionsService } from '../questions/questions.service';
import { CreatelngQuestionDto } from '../questions/dto/create-lng-question.dto';
import { CreateShortQuestionDto } from '../questions/dto/create-short-question.dto';
import { CreateMcqQuestionDto } from '../questions/dto/create-mcq-question.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly bookService: BookService,
    private readonly chapterService: ChapterService,
    private readonly questionsService: QuestionsService,
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

  @Post('createLongQuestion')
  createLongQuestion(@Body() dto: CreatelngQuestionDto) {
    return this.questionsService.createLongQuestion(dto);
  }

  @Post('createShortQuestion')
  createShortQuestion(@Body() dto: CreateShortQuestionDto) {
    return this.questionsService.createShortQuestion(dto);
  }

  @Post('createMcqQuestion')
  createMcqQuestion(@Body() dto: CreateMcqQuestionDto) {
    return this.questionsService.createMcqQuestion(dto);
  }

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
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
