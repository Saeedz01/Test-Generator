import { IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  book_name!: string;

  @IsOptional()
  @IsString()
  bookNameUr?: string;

  @IsString()
  class_name!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  descriptionUr?: string;

  @IsString()
  edition!: string;
}
