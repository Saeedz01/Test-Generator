import { Chapter } from '../../chapter/entities/chapter.entity';

export class ShortQuestion {
  id!: string;

  question_text!: string;

  questionTextUr!: string | null;

  chapter!: Chapter;

  createdAt!: Date;

  updatedAt!: Date;
}
