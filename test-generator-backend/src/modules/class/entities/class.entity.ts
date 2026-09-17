import { Book } from 'src/modules/book/entities/book.entity';

export class schoolClass {
  id!: string;

  name!: string;

  code!: string;

  description!: string | null;

  sortOrder!: number;

  createdAt!: Date;

  updatedAt!: Date;

  books!: Book[];
}
