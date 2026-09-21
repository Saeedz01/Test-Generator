export const ERROR_MESSAGES = {
  CLASS_NOT_FOUND: 'Class not found',
  BOOK_NOT_FOUND: 'Book not found',
  BOOKS_NOT_FOUND: 'There are no book',
  CHAPTER_NOT_FOUND: 'Chapter not found',
  BOOK_EXISTS_IN_CLASS: 'This class already has a book with this name',
  BOOK_EXISTS_DELETED:
    'A deleted book with this name exists in this class. Restore it from "Deleted books" instead of creating a new one.',

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
  SERVICE_NOT_READY:
    'The server is still being set up and cannot handle this request yet. Please try again in a few minutes.',
  SERVICE_UNAVAILABLE:
    'The service is temporarily unavailable. Please try again in a few minutes.',
  RESET_CODE_INVALID:
    'The reset code is invalid or has expired. Request a new code and try again.',
  OTP_SEND_FAILED:
    'We could not send the verification code. Please try again in a moment.',
} as const;
