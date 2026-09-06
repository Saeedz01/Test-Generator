import { schoolClass } from '../../class/entities/class.entity';
import { Book } from '../../book/entities/book.entity';
import { LongQuestion } from '../../questions/entities/question.longQuestion';
import { ShortQuestion } from '../../questions/entities/question.shortQuestion';
import { McqQuestion } from '../../questions/entities/question.mcqs';

export class Chapter {
  id!: string;

  class!: schoolClass;

  book!: Book;

  questions!: LongQuestion[];

  shortQuestions!: ShortQuestion[];

  mcqQuestions!: McqQuestion[];

  chapter_name!: string;

  order!: number;

  description!: string | null;

  createdAt!: Date;

  updatedAt!: Date;
}
