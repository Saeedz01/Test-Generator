import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8)
  // bcrypt only uses the first 72 bytes of a password
  @MaxLength(72)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}
