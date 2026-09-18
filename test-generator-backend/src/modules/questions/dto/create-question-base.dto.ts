import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { QuestionDifficulty } from '@prisma/client';
import { MaxByteLength } from 'src/common/validators/max-byte-length.validator';

/**
 * (chapterId, question_text) has a unique btree index; Postgres cannot index
 * rows over ~2.7 KB, so the statement is capped by characters and bytes.
 * (Alternative if longer statements are ever needed: a unique index on
 * md5(question_text) instead of the raw text.)
 */
export const QUESTION_STATEMENT_MAX_LENGTH = 2000;
export const QUESTION_STATEMENT_MAX_BYTES = 2400;

export class CreateQuestionBaseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(QUESTION_STATEMENT_MAX_LENGTH)
  @MaxByteLength(QUESTION_STATEMENT_MAX_BYTES)
  statement: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
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
