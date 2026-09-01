import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  classId: string;
  
  @IsString()
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