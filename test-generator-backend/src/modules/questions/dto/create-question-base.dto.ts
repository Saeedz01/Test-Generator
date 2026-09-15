import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateQuestionBaseDto {
  @IsString()
  statement: string;

  @IsOptional()
  @IsString()
  statementUr?: string;

  @IsUUID()
  chapterId: string;
}
