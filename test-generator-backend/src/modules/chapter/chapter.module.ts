import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { ClassModule } from '../class/class.module';
import { BookModule } from '../book/book.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter]),
    ClassModule,
    BookModule,
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [TypeOrmModule, ChapterService],
})
export class ChapterModule {}
