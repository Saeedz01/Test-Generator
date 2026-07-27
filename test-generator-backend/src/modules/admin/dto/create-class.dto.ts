import { IsString, } from 'class-validator';

export class CreateSchoolClassDto {
  @IsString()
  name !: string;
  code !: string;
  description !: string;
}