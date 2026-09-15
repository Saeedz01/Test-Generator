import { Book } from '../../book/entities/book.entity';
import { LongQuestion } from '../../questions/entities/question.longQuestion';
import { ShortQuestion } from '../../questions/entities/question.shortQuestion';
import { McqQuestion } from '../../questions/entities/question.mcqs';

export class Chapter {
  id!: string;

  book!: Book;

  questions!: LongQuestion[];

  shortQuestions!: ShortQuestion[];

  mcqQuestions!: McqQuestion[];

  chapter_name!: string;

  chapterNameUr!: string | null;

  order!: number;

  description!: string | null;

  descriptionUr!: string | null;

  createdAt!: Date;

  updatedAt!: Date;
}
