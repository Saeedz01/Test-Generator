import { schoolClass } from '../../class/entities/class.entity';
import { Book } from '../../book/entities/book.entity';
import { Chapter } from '../../chapter/entities/chapter.entity';

export class LongQuestion {
    id!: string;

    question_text!: string;

    class!: schoolClass;

    book!: Book;

    chapter!: Chapter;

    createdAt!: Date;

    updatedAt!: Date;
}
