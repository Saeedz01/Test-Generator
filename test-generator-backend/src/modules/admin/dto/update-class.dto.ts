import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateSchoolClassDto } from './create-class.dto';

export class UpdateClassDto extends PartialType(CreateSchoolClassDto) {
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
