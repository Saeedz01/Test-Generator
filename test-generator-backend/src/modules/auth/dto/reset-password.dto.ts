import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  IsAdminPassword,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from 'src/common/validators/text.validators';

export class ResetPasswordDto {
  @IsString()
  @MaxLength(PASSWORD_MAX_LENGTH)
  oldPassword: string;

  @IsString()
  @IsAdminPassword()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  newPassword: string;
}
