import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(72)
  password: string;
}
