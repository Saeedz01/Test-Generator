import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import {
  IsAdminPassword,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from 'src/common/validators/text.validators';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @IsAdminPassword()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  password!: string;
}
