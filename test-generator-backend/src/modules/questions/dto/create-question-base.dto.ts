import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateQuestionBaseDto {
  @IsString()
  @IsNotEmpty()
  statement: string;

  @IsString()
  @IsNotEmpty()
  statementUr: string;

  @IsUUID()
  chapterId: string;
}
