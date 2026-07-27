import { PartialType } from '@nestjs/mapped-types';
import { CreateSchoolClassDto } from './create-class.dto';

export class UpdateClassDto extends PartialType(CreateSchoolClassDto) {}
