import { IsString, IsUUID, IsArray, ArrayMinSize, ArrayMaxSize } from "class-validator";

export class CreateMcqQuestionDto {
    @IsString()
    statement: string;

    @IsArray()
    @ArrayMinSize(4)
    @ArrayMaxSize(4)
    @IsString({ each: true })
    options: string[];

    @IsUUID()
    classId: string;

    @IsUUID()
    bookId: string;

    @IsUUID()
    chapterId: string;
}
