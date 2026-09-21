import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  IsAdminPassword,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from 'src/common/validators/text.validators';

export class ConfirmResetPasswordDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @Matches(/^\d{8}$/, { message: 'The reset code must be 8 digits' })
  token: string;

  @IsString()
  @IsAdminPassword()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  newPassword: string;
}
