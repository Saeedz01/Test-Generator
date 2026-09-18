import { IsString, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MaxLength(255)
  book_name!: string;

  @IsString()
  @MaxLength(255)
  class_name!: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsString()
  @MaxLength(100)
  edition!: string;
}
