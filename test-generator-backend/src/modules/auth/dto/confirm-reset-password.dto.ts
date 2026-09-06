import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ConfirmResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 8)
  token: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
