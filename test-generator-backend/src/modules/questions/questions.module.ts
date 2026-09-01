import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LongQuestion } from './entities/question.longQuestion';
import { ShortQuestion } from './entities/question.shortQuestion';
import { McqQuestion } from './entities/question.mcqs';
import { ClassModule } from '../class/class.module';
import { BookModule } from '../book/book.module';
import { ChapterModule } from '../chapter/chapter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LongQuestion, ShortQuestion, McqQuestion]),
    ClassModule,
    BookModule,
    ChapterModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService, TypeOrmModule],
})
export class QuestionsModule {}
