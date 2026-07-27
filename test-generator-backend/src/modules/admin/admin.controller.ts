import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateSchoolClassDto } from './dto/create-class.dto';
import { BookService } from '../book/book.service';
import { CreateBookDto } from '../book/dto/create-book.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly bookService: BookService
  ) {}

  @Post('createClass')
  createClass(@Body() dto: CreateSchoolClassDto) {
    return this.adminService.createClass(dto);
  }

  @Post('createBook')
  createBook(@Body() dto: CreateBookDto) {
    return this.bookService.createBook(dto);
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
