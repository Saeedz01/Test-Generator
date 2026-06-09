import { IsString, IsUUID } from "class-validator";

export class CreateShortQuestionDto {
    @IsString()
    statement: string;
    
    @IsUUID()
    classId: string;
    
    @IsUUID()
    bookId: string;
    
    @IsUUID()
    chapterId: string;
}
