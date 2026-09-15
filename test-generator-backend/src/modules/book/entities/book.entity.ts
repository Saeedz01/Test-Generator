import { schoolClass } from 'src/modules/class/entities/class.entity';
import { Chapter } from 'src/modules/chapter/entities/chapter.entity';

export class Book {
  id!: string;

  book_name!: string;

  bookNameUr!: string | null;

  description!: string | null;

  descriptionUr!: string | null;

  edition!: string | null;

  created_At!: Date;

  updated_At!: Date;

  class!: schoolClass;

  chapters!: Chapter[];
}
