import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { QuestionDifficulty } from '@prisma/client';

export class CreateQuestionBaseDto {
  @IsString()
  @IsNotEmpty()
  statement: string;

  @IsString()
  @IsNotEmpty()
  statementUr: string;

  @IsUUID()
  chapterId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  marks?: number;

  @IsOptional()
  @IsEnum(QuestionDifficulty)
  difficulty?: QuestionDifficulty;
}
