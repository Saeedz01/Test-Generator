import { PartialType } from '@nestjs/mapped-types';
import { CreatelngQuestionDto } from './create-lng-question.dto';

export class UpdateQuestionDto extends PartialType(CreatelngQuestionDto) {}
