import { schoolClass } from 'src/modules/class/entities/class.entity';
import { Chapter } from 'src/modules/chapter/entities/chapter.entity';
import { LongQuestion } from 'src/modules/questions/entities/question.longQuestion';
import { ShortQuestion } from 'src/modules/questions/entities/question.shortQuestion';
import { McqQuestion } from 'src/modules/questions/entities/question.mcqs';

export class Book {
    id!: string;

    book_name!: string;

    description!: string | null;

    edition!: string | null;

    created_At!: Date;

    updated_At!: Date;

    class!: schoolClass;

    chapters!: Chapter[];

    questions!: LongQuestion[];

    shortQuestions!: ShortQuestion[];

    mcqQuestions!: McqQuestion[];
}
