import { Chapter } from '../../chapter/entities/chapter.entity';

export class McqQuestion {
  id!: string;

  question_text!: string;

  questionTextUr!: string | null;

  options!: Array<{ en: string; ur: string }>;

  marks!: number;

  difficulty!: 'easy' | 'medium' | 'hard';

  chapter!: Chapter;

  createdAt!: Date;

  updatedAt!: Date;
}
