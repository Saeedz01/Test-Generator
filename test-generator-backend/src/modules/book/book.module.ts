import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { ClassModule } from '../class/class.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    ClassModule,
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [TypeOrmModule, BookService],
})
export class BookModule {}
