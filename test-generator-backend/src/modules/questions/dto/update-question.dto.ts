import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-lngquestion.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
