import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateSchoolClassDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
