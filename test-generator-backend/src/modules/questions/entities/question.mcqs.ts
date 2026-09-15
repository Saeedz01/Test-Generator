import { Chapter } from '../../chapter/entities/chapter.entity';

export class McqQuestion {
  id!: string;

  question_text!: string;

  questionTextUr!: string | null;

  options!: Array<{ en: string; ur: string }>;

  chapter!: Chapter;

  createdAt!: Date;

  updatedAt!: Date;
}
