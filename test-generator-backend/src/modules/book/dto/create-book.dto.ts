import { IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  book_name !: string;

  @IsString()
  class_name !: string;

  @IsString()
  description !: string;

  @IsString()
  edition !: string;
}