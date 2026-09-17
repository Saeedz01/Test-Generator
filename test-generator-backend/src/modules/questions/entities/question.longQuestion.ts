import { Chapter } from '../../chapter/entities/chapter.entity';

export class LongQuestion {
  id!: string;

  question_text!: string;

  questionTextUr!: string | null;

  marks!: number;

  difficulty!: 'easy' | 'medium' | 'hard';

  chapter!: Chapter;

  createdAt!: Date;

  updatedAt!: Date;
}
