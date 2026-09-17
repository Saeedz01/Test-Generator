import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListQuestionsQueryDto {
  @IsOptional()
  @IsUUID()
  chapterId?: string;

  @IsOptional()
  @IsUUID()
  bookId?: string;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 100;
}
