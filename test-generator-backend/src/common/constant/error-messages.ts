export const ERROR_MESSAGES = {
  CLASS_NOT_FOUND: 'Class not found',
  BOOK_NOT_FOUND: 'Book not found',
  BOOKS_NOT_FOUND: 'There are no book',
  CHAPTER_NOT_FOUND: 'Chapter not found',

  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_ROLE_NOT_FOUND: 'User role not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_TOKEN: 'Token expired or invalid',
  INVALID_OTP: 'Invalid or expired OTP',
  ACCOUNT_SUSPENDED: 'Your account has been suspended',

  VALIDATION_FAILED: 'Validation failed',
  PERMISSION_DENIED: 'Permission denied',

  INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again.',
  SERVICE_UNAVAILABLE:
    'The service is temporarily unavailable. Please try again in a few minutes.',
  OTP_SEND_FAILED:
    'We could not send the verification code. Please try again in a moment.',
} as const;
