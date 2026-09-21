import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TrimString } from 'src/common/validators/text.validators';

export class CreateBookDto {
  @TrimString()
  @IsString()
  @IsNotEmpty({ message: 'Book name must not be empty' })
  @MaxLength(255)
  book_name!: string;

  @TrimString()
  @IsString()
  @IsNotEmpty({ message: 'Class name must not be empty' })
  @MaxLength(255)
  class_name!: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsString()
  @MaxLength(100)
  edition!: string;
}
