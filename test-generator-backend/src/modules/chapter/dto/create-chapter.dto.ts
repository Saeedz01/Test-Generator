import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateChapterDto {
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @IsString()
  @IsNotEmpty()
  chapter_name: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsOptional()
  @IsString()
  description?: string;
}
