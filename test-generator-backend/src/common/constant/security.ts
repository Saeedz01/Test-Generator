/**
 * bcrypt cost for admin passwords. Hashes made with a lower cost keep
 * working and are upgraded transparently at the next successful sign-in.
 */
export const PASSWORD_BCRYPT_ROUNDS = 12;

/** Short-lived random codes (login OTP, reset code) are attempt-limited. */
export const CODE_BCRYPT_ROUNDS = 10;
