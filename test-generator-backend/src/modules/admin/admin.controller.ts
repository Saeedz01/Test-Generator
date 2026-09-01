import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateSchoolClassDto } from './dto/create-class.dto';
import { BookService } from '../book/book.service';
import { CreateBookDto } from '../book/dto/create-book.dto';
import { UpdateBookDto } from '../book/dto/update-book.dto';
import { ChapterService } from '../chapter/chapter.service';
import { CreateChapterDto } from '../chapter/dto/create-chapter.dto';
import { UpdateChapterDto } from '../chapter/dto/update-chapter.dto';
import { QuestionsService } from '../questions/questions.service';
import { CreatelngQuestionDto } from '../questions/dto/create-lng-question.dto';
import { CreateShortQuestionDto } from '../questions/dto/create-short-question.dto';
import { CreateMcqQuestionDto } from '../questions/dto/create-mcq-question.dto';
import { UpdateQuestionDto } from '../questions/dto/update-question.dto';
import { UpdateMcqQuestionDto } from '../questions/dto/update-mcq-question.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from '../user/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
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

  @Patch('updateBook/:id')
  updateBook(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  @Delete('deleteBook/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  @Post('createChapter')
  createChapter(@Body() dto: CreateChapterDto) {
    return this.chapterService.create(dto);
  }

  @Patch('updateChapter/:id')
  updateChapter(@Param('id') id: string, @Body() dto: UpdateChapterDto) {
    return this.chapterService.update(id, dto);
  }

  @Delete('deleteChapter/:id')
  deleteChapter(@Param('id') id: string) {
    return this.chapterService.remove(id);
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

  @Patch('updateLongQuestion/:id')
  updateLongQuestion(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionsService.updateLongQuestion(id, dto);
  }

  @Patch('updateShortQuestion/:id')
  updateShortQuestion(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionsService.updateShortQuestion(id, dto);
  }

  @Patch('updateMcqQuestion/:id')
  updateMcqQuestion(@Param('id') id: string, @Body() dto: UpdateMcqQuestionDto) {
    return this.questionsService.updateMcqQuestion(id, dto);
  }

  @Delete('deleteLongQuestion/:id')
  deleteLongQuestion(@Param('id') id: string) {
    return this.questionsService.removeLngQ(id);
  }

  @Delete('deleteShortQuestion/:id')
  deleteShortQuestion(@Param('id') id: string) {
    return this.questionsService.removeShortQ(id);
  }

  @Delete('deleteMcqQuestion/:id')
  deleteMcqQuestion(@Param('id') id: string) {
    return this.questionsService.removeMcqQ(id);
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
