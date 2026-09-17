import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateQuestionBaseDto } from './create-question-base.dto';

export class McqOptionDto {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  ur: string;
}

export class CreateMcqQuestionDto extends CreateQuestionBaseDto {
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => McqOptionDto)
  options: McqOptionDto[];
}
