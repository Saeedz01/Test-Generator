import { IsArray, ArrayMinSize, ArrayMaxSize, IsString } from 'class-validator';
import { CreateQuestionBaseDto } from './create-question-base.dto';

export class CreateMcqQuestionDto extends CreateQuestionBaseDto {
    @IsArray()
    @ArrayMinSize(4)
    @ArrayMaxSize(4)
    @IsString({ each: true })
    options: string[];
}
