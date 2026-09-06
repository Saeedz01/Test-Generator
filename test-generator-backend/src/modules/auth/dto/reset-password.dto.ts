import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
