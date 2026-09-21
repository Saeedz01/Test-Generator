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
import { TrimString } from 'src/common/validators/text.validators';

export class CreateChapterDto {
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @TrimString()
  @IsString()
  @IsNotEmpty({ message: 'Chapter name must not be empty' })
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
