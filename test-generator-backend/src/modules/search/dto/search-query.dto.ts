import { IsString, MaxLength, MinLength } from 'class-validator';
import { TrimString } from 'src/common/validators/text.validators';

export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_MAX_LENGTH = 100;

export class SearchQueryDto {
  @TrimString()
  @IsString()
  @MinLength(SEARCH_MIN_LENGTH, {
    message: `Search term must be at least ${SEARCH_MIN_LENGTH} characters`,
  })
  @MaxLength(SEARCH_MAX_LENGTH)
  q!: string;
}
