import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateChapterDto {
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  chapter_name: string;

  @IsInt()
  @Min(0)
  @Max(100_000)
  @IsNotEmpty()
  order: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
