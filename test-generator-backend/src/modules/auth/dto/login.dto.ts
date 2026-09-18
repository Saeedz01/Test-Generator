import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(72)
  password: string;

  @IsOptional()
  @IsString()
  @Length(6, 6)
  otp?: string;
}
