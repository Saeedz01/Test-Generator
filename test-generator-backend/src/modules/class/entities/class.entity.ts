import { Chapter } from 'src/modules/chapter/entities/chapter.entity';
import { Book } from 'src/modules/book/entities/book.entity';
import { LongQuestion } from 'src/modules/questions/entities/question.longQuestion';
import { ShortQuestion } from 'src/modules/questions/entities/question.shortQuestion';
import { McqQuestion } from 'src/modules/questions/entities/question.mcqs';

export class schoolClass {
    id!: string;

    name!: string;

    code!: string;

    description!: string | null;

    sortOrder!: number;

    createdAt!: Date;

    updatedAt!: Date;

    books!: Book[];

    chapters!: Chapter[];

    questions!: LongQuestion[];

    shortQuestions!: ShortQuestion[];

    mcqQuestions!: McqQuestion[];
}
