import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BookModule } from '../book/book.module';
import { ChapterModule } from '../chapter/chapter.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    BookModule,
    ChapterModule,
    QuestionsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
