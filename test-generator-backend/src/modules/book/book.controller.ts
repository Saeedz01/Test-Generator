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
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AdminOnly } from 'src/common/decorator/admin-only.decorator';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @AdminOnly()
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Get()
  findAll(
    @Query('classId', new ParseUUIDPipe({ optional: true })) classId?: string,
  ) {
    return this.bookService.findAll(classId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookService.findOne(id);
  }

  @AdminOnly()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  // Soft delete: hides the book and its content; restorable by admins.
  @AdminOnly()
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.bookService.remove(id, req.user.id);
  }

  @AdminOnly()
  @Post(':id/restore')
  restore(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.bookService.restore(id, req.user.id);
  }
}
