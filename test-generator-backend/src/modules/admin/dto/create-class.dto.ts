import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSchoolClassDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
