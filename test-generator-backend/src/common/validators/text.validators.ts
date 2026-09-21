import { Transform } from 'class-transformer';
import { ValidateBy, ValidationOptions, buildMessage } from 'class-validator';

/**
 * Trims surrounding whitespace before validation, so `@IsNotEmpty()` also
 * rejects whitespace-only values and names are stored without padding.
 * Non-string values are passed through for `@IsString()` to reject.
 */
export function TrimString(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );
}

export const PASSWORD_MIN_LENGTH = 8;
// bcrypt only uses the first 72 bytes of a password
export const PASSWORD_MAX_LENGTH = 72;

/**
 * Admin passwords are never trimmed. Instead a password that is only
 * whitespace, or that starts/ends with whitespace, is rejected so what the
 * admin typed is exactly what they must type to sign in.
 */
export function isAcceptablePassword(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value === value.trim()
  );
}

export function IsAdminPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isAdminPassword',
      validator: {
        validate: (value: unknown): boolean => isAcceptablePassword(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}$property must not be blank or start/end with spaces`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
