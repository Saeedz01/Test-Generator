import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TrimString } from 'src/common/validators/text.validators';

export class CreateSchoolClassDto {
  @TrimString()
  @IsString()
  @IsNotEmpty({ message: 'Class name must not be empty' })
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @TrimString()
  @IsString()
  @IsNotEmpty({ message: 'Class code must not be empty' })
  @MaxLength(50)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
