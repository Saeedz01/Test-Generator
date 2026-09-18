import { ValidateBy, ValidationOptions, buildMessage } from 'class-validator';

/**
 * Limits the UTF-8 encoded size of a string. Used for columns that sit in a
 * btree index (Postgres rejects index rows larger than ~2.7 KB), where a
 * character limit alone is not enough for multi-byte text.
 */
export function MaxByteLength(
  maxBytes: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'maxByteLength',
      constraints: [maxBytes],
      validator: {
        validate: (value: unknown): boolean =>
          typeof value !== 'string' ||
          Buffer.byteLength(value, 'utf8') <= maxBytes,
        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}$property is too long (max $constraint1 bytes)`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
