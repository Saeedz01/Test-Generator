import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { schoolClass } from '../class/entities/class.entity';
import { Book } from '../book/entities/book.entity';
import { Chapter } from '../chapter/entities/chapter.entity';
import { LongQuestion } from '../questions/entities/question.longQuestion';
import { ShortQuestion } from '../questions/entities/question.shortQuestion';
import { McqQuestion } from '../questions/entities/question.mcqs';
import { BookModule } from '../book/book.module';
import { ChapterModule } from '../chapter/chapter.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      schoolClass,
      Book,
      Chapter,
      LongQuestion,
      ShortQuestion,
      McqQuestion,
    ]),
    BookModule,
    ChapterModule,
    QuestionsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
