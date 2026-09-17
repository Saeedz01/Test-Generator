import { schoolClass } from 'src/modules/class/entities/class.entity';
import { Chapter } from 'src/modules/chapter/entities/chapter.entity';

export class Book {
  id!: string;

  book_name!: string;

  description!: string | null;

  edition!: string | null;

  createdAt!: Date;

  updatedAt!: Date;

  class!: schoolClass;

  chapters!: Chapter[];
}
