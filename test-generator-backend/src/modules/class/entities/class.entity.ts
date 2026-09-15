import { Book } from 'src/modules/book/entities/book.entity';

export class schoolClass {
  id!: string;

  name!: string;

  nameUr!: string | null;

  code!: string;

  description!: string | null;

  descriptionUr!: string | null;

  sortOrder!: number;

  createdAt!: Date;

  updatedAt!: Date;

  books!: Book[];
}
